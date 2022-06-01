import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../src/user/user.module";
import { ClubModule } from "../src/club/club.module";
import { MessageModule } from "../src/message/message.module";
import { DonationModule } from "../src/donation/donation.module";

describe("Messages tests ", () => {
  let app: INestApplication;
  let RandomUsername: string;

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
    await app.init();
  });

  describe("Create club and send message in it", () => {
    let clubId;
    let token;
    let userId;

    it("send message", async () => {
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
        .expect(201)
        .expect((response) => {
          clubId = response.body.clubId;
        });

      //send message
      return request(app.getHttpServer())
        .post("/messages")
        .send({
          uuid: token,
          clubId: clubId,
          message: "This is a message. 42",
        })
        .expect(201);
    });

    it("send message unlogged", async () => {
      //send message
      return request(app.getHttpServer())
        .post("/messages")
        .send({
          uuid: "fake",
          clubId: clubId,
          message: "This is a message. 42",
        })
        .expect(401);
    });

    it("get messages", async () => {
      //send message
      return request(app.getHttpServer())
        .get(`/club/${clubId}/messages`)
        .expect(200)
        .expect((response) => {
          expect(response.body.messages.length).toEqual(1);
          expect(response.body.messages[0].message).toEqual(
            "This is a message. 42"
          );
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
