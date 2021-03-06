import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../src/user/user.module";
import { ClubModule } from "../src/club/club.module";
import { MessageModule } from "../src/message/message.module";
import { DonationModule } from "../src/donation/donation.module";
import { CREATE_CLUB_FEE, JOIN_CLUB_FEE } from "../src/common/constants";

describe("Donations tests ", () => {
  let app: INestApplication;
  let RandomUsername: string;
  let AnotherRandomUsername: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            type: "mysql",
            host: configService.get("DB_HOST"),
            port: configService.get("DB_PORT"),
            username: configService.get("DB_USERNAME"),
            password: configService.get("DB_PASSWORD"),
            database: configService.get("DB_NAME"),
            autoLoadEntities: true,
            synchronize: false,
          }),
          inject: [ConfigService],
        }),
        UserModule,
        ClubModule,
        MessageModule,
        DonationModule,
      ],
      controllers: [],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    RandomUsername = "user_" + Date.now();
    AnotherRandomUsername = "new_user_" + Date.now();
    await app.init();
  });

  describe("Create creation", () => {
    let clubId;
    let fundingId;

    let wallet;
    let token;
    let userId;

    let wallet_user2;
    let userId_user2;
    let token_user2;

    it("Create user, club and donation request", async () => {
      //create user
      await request(app.getHttpServer())
        .post("/user")
        .send({ username: RandomUsername, password: "123465" })
        .expect(201)
        .expect((response) => {
          userId = response.body.id;
        });

      //add currency
      await request(app.getHttpServer())
        .patch(`/user/${userId}/addCurrency`)
        .send({
          hard_currency: 0,
          soft_currency: 50,
        })
        .expect(200);

      //login
      await request(app.getHttpServer())
        .post("/user/login")
        .send({ username: RandomUsername, password: "123465" })
        .expect(201)
        .expect((response) => {
          token = response.body.uuid;
        });

      // create club
      await request(app.getHttpServer())
        .post("/club")
        .send({ uuid: token, name: "a new club" })
        .expect((response) => {
          clubId = response.body.clubId;
        });

      //create donation request
      return request(app.getHttpServer())
        .post(`/club/${clubId}/donationRequest`)
        .send({ uuid: token, amount: 20 })
        .expect(201)
        .expect((response) => {
          fundingId = response.body.id;
        });
    });

    it("Donate money", async () => {
      //create user
      await request(app.getHttpServer())
        .post("/user")
        .send({ username: AnotherRandomUsername, password: "123465" })
        .expect(201)
        .expect((response) => {
          userId_user2 = response.body.id;
        });

      //add currency
      await request(app.getHttpServer())
        .patch(`/user/${userId_user2}/addCurrency`)
        .send({
          hard_currency: 0,
          soft_currency: 500,
        })
        .expect(200);

      //login
      await request(app.getHttpServer())
        .post("/user/login")
        .send({ username: AnotherRandomUsername, password: "123465" })
        .expect(201)
        .expect((response) => {
          token_user2 = response.body.uuid;
        });

      // join club
      await request(app.getHttpServer())
        .post(`/club/join/${clubId}`)
        .send({ uuid: token_user2 })
        .expect(201);

      //get current infos
      await request(app.getHttpServer())
        .get(`/user/${userId_user2}`)
        .expect(200)
        .expect((response) => {
          wallet_user2 = response.body.wallet;
        });

      //check user1 wallet status
      await request(app.getHttpServer())
        .get(`/user/${userId}`)
        .expect(200)
        .expect((response) => {
          wallet = response.body.wallet;
        });

      //donate
      await request(app.getHttpServer())
        .post(`/funding/${fundingId}`)
        .send({ uuid: token_user2, amount: 10 })
        .expect(201);

      //check wallet user 2
      await request(app.getHttpServer())
        .get(`/user/${userId_user2}`)
        .expect(200)
        .expect((response) => {
          expect(response.body.wallet.soft_currency).toEqual(
            wallet_user2.soft_currency - 10
          );
        });

      //send more money
      await request(app.getHttpServer())
        .post(`/funding/${fundingId}`)
        .send({ uuid: token_user2, amount: 10 })
        .expect(201);

      //check wallet user1
      return request(app.getHttpServer())
        .get(`/user/${userId}`)
        .expect(200)
        .expect((response) => {
          expect(response.body.wallet.soft_currency).toEqual(
            wallet.soft_currency + 20
          );
        });
    });

    it("Donatiuon closed", async () => {
      await request(app.getHttpServer())
        .post(`/funding/${fundingId}`)
        .send({ uuid: token_user2, amount: 10 })
        .expect(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
