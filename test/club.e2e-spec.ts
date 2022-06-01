import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../src/user/user.module";
import { ClubModule } from "../src/club/club.module";
import { MessageModule } from "../src/message/message.module";
import { DonationModule } from "../src/donation/donation.module";
import {CREATE_CLUB_FEE, HARD_MAX, JOIN_CLUB_FEE, SOFT_MAX} from "../src/common/constants";
import { clearDb } from "./helpers";

describe("Club tests ", () => {
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

  describe("Club creation", () => {

    let clubId;

    it("Non logged users can't creat clubs", () => {
      return request(app.getHttpServer())
        .post("/club")
        .send({ uuid: "123-456", name: "name of the club" })
        .expect(401)
        .expect((response) => {
          expect(response.body.message).toEqual('You must be logged in to create a new club');
        });
    });

    it("name must be longer than 3 chars", () => {
      return request(app.getHttpServer())
        .post("/club")
        .send({ uuid: "123-456", name: "as" })
        .expect(400)
        .expect((response) => {
          expect(response.body.message.length).toEqual(1);
        });
    });

    it("Logged users can create clubs", async () => {

      let token;
      let wallet;
      let userId;

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
          soft_currency: 500,
        })
        .expect(200)


      //login
      await request(app.getHttpServer())
        .post("/user/login")
        .send({ username: RandomUsername, password: "123465" })
        .expect(201)
        .expect((response) => {
          token = response.body.uuid;
        });

      //get current infos
      await request(app.getHttpServer())
        .get(`/user/${userId}`)
        .expect(200)
        .expect((response) => {
          wallet = response.body.wallet;
        });

      // create club
      await request(app.getHttpServer())
        .post("/club")
        .send({ uuid: token, name: "a new club" })
        .expect((response) => {
          clubId = response.body.clubId;
        });

      return request(app.getHttpServer())
        .get(`/user/${userId}`)
        .expect(200)
        .expect((response) => {
          expect(response.body.wallet.soft_currency).toEqual(wallet.soft_currency-CREATE_CLUB_FEE)
        });
    });

    describe("Users joining clubs", () => {

      let token;
      let wallet;
      let userId;

      it("Users can't join clubs not logged", async () => {

        //create user
        await request(app.getHttpServer())
          .post("/user")
          .send({username: AnotherRandomUsername, password: "123465"})
          .expect(201)
          .expect((response) => {
            userId = response.body.id;
          });

        //join club not logged
        return request(app.getHttpServer())
          .post(`/club/join/${clubId}`)
          .send({uuid: 'not-valid'})
          .expect(401)
      });

      it("Users can join clubs and pay fee if logged ", async () => {

        //login
        await request(app.getHttpServer())
          .post("/user/login")
          .send({username: AnotherRandomUsername, password: "123465"})
          .expect(201)
          .expect((response) => {
            token = response.body.uuid;
          });

        //get current infos
        await request(app.getHttpServer())
          .get(`/user/${userId}`)
          .expect(200)
          .expect((response) => {
            wallet = response.body.wallet;
          });

        // join club logged
        await request(app.getHttpServer())
          .post(`/club/join/${clubId}`)
          .send({uuid: token})
          .expect(201)

        return request(app.getHttpServer())
          .get(`/user/${userId}`)
          .expect(200)
          .expect((response) => {
            expect(response.body.wallet.soft_currency).toEqual(wallet.soft_currency - JOIN_CLUB_FEE)
          });
      });

      it("Users can't join twice in club", async () => {

        // join club logged
        return request(app.getHttpServer())
          .post(`/club/join/${clubId}`)
          .send({uuid: token})
          .expect(401)

      });
    });
  });

  it.todo("check for club with > 50 members")

  afterAll(async () => {
    //await clearDb();
    await app.close();
  });
});
