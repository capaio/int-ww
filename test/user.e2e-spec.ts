import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../src/user/user.module";
import { ClubModule } from "../src/club/club.module";
import { MessageModule } from "../src/message/message.module";
import { DonationModule } from "../src/donation/donation.module";
import { HARD_MAX, SOFT_MAX } from "../src/common/constants";
import { clearDb } from "./helpers";

describe("Api Controller ", () => {
  let app: INestApplication;
  let RandomUsername: string;
  let AntoherRandomUsername: string;

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
    AntoherRandomUsername = "new_user_" + Date.now();
    await app.init();
  });

  describe("User", () => {
    it("save user with no data returns error", () => {
      return request(app.getHttpServer())
        .post("/user")
        .send()
        .expect(400)
        .expect((response) => {
          expect(response.body.message.length).toEqual(7);
        });
    });

    it("save user correctly", () => {
      return request(app.getHttpServer())
        .post("/user")
        .send({ username: RandomUsername, password: "123465" })
        .expect(201);
    });

    it("save user with same username gives error", () => {
      return request(app.getHttpServer())
        .post("/user")
        .send({ username: RandomUsername, password: "123465" })
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toEqual("Username already taken");
        });
    });
  });

  describe("add currency", () => {
    let wallet;
    let userId;

    it("adds correct values ", async () => {
      await request(app.getHttpServer())
        .post("/user")
        .send({ username: AntoherRandomUsername, password: "123465" })
        .expect(201)
        .expect((response) => {
          wallet = response.body.wallet;
          userId = response.body.id;
        });

      await request(app.getHttpServer())
        .patch(`/user/${userId}/addCurrency`)
        .send({
          hard_currency: 5,
          soft_currency: 5,
        })
        .expect(200)
        .expect((response) => {
          expect(response.body.hard_currency).toEqual(wallet.hard_currency + 5);
          expect(response.body.soft_currency).toEqual(wallet.soft_currency + 5);
        });
    });

    it("adds max 100 and 1000 ", async () => {
      await request(app.getHttpServer())
        .patch(`/user/${userId}/addCurrency`)
        .send({
          hard_currency: 99,
          soft_currency: 999,
        })
        .expect(200)
        .expect((response) => {
          expect(response.body.hard_currency).toEqual(HARD_MAX);
          expect(response.body.soft_currency).toEqual(SOFT_MAX);
        });
    });

    it("return error if values are not integer ", async () => {
      await request(app.getHttpServer())
        .patch(`/user/${userId}/addCurrency`)
        .send({
          hard_currency: 2.5,
          soft_currency: 50.2,
        })
        .expect(400)
        .expect((response) => {
          expect(response.body.message.length).toEqual(2);
        });
    });
  });

  afterAll(async () => {
    await clearDb();
    await app.close();
  });
});
