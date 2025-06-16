import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Wishlist API",
    version: "1.0.0",
    description:
      "API for managing wishlists, events, gifts, and public interactions",
  },
  servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
  tags: [
    {
      name: "Auth",
      description:
        "Authentication, user registration, and password reset endpoints",
    },
    {
      name: "User",
      description: "User settings and profile management",
    },
    {
      name: "Event",
      description: "Event (wishlist) creation, management, and sharing",
    },
    {
      name: "Gift",
      description: "Gift management and reservation within events",
    },
    {
      name: "Public",
      description: "Public access to gifts and events",
    },
  ],
  paths: {
    "/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "User sign up",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                  name: { type: "string", nullable: true },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        email: { type: "string" },
                        name: { type: "string", nullable: true },
                      },
                    },
                    token: { type: "string" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/signin": {
      post: {
        tags: ["Auth"],
        summary: "User sign in",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User authenticated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        email: { type: "string" },
                        name: { type: "string", nullable: true },
                      },
                    },
                    token: { type: "string" },
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Request password reset code",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                },
                required: ["email"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Reset code sent",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/verify-code": {
      post: {
        tags: ["Auth"],
        summary: "Verify password reset code",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  code: { type: "string", minLength: 6, maxLength: 6 },
                },
                required: ["email", "code"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Code verified",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    resetToken: { type: "string" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Reset password with token",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  resetToken: { type: "string" },
                  newPassword: { type: "string", minLength: 6 },
                },
                required: ["resetToken", "newPassword"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Password reset successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users/settings": {
      get: {
        tags: ["User"],
        summary: "Get user settings",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "User settings retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    email: { type: "string" },
                    name: { type: "string", nullable: true },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["User"],
        summary: "Update user settings",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  name: { type: "string", nullable: true },
                  password: { type: "string", minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User settings updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    email: { type: "string" },
                    name: { type: "string", nullable: true },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/events": {
      get: {
        tags: ["Event"],
        summary: "Get user events",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "List of user events",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      title: { type: "string" },
                      userId: { type: "integer" },
                      createdAt: { type: "string", format: "date-time" },
                      updatedAt: { type: "string", format: "date-time" },
                      gifts: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "integer" },
                            name: { type: "string" },
                            eventId: { type: "integer" },
                            isReserved: { type: "boolean" },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" },
                          },
                        },
                      },
                      publicUrl: { type: "string", nullable: true },
                      publicUrlExpiration: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                      },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Event"],
        summary: "Create an event",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                },
                required: ["title"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Event created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    title: { type: "string" },
                    userId: { type: "integer" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                    publicUrl: { type: "string", nullable: true },
                    publicUrlExpiration: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/events/{id}": {
      put: {
        tags: ["Event"],
        summary: "Update an event",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                },
                required: ["title"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Event updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    title: { type: "string" },
                    userId: { type: "integer" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                    publicUrl: { type: "string", nullable: true },
                    publicUrlExpiration: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Event"],
        summary: "Delete an event",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "204": {
            description: "Event deleted",
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/events/{id}/share": {
      post: {
        tags: ["Event"],
        summary: "Share an event",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Public URL generated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    publicUrl: { type: "string" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/events/public/{shortId}": {
      get: {
        tags: ["Event"],
        summary: "Get public event by short URL",
        parameters: [
          {
            name: "shortId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Public event details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    title: { type: "string" },
                    userId: { type: "integer" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                    gifts: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "integer" },
                          name: { type: "string" },
                          eventId: { type: "integer" },
                          isReserved: { type: "boolean" },
                          createdAt: { type: "string", format: "date-time" },
                          updatedAt: { type: "string", format: "date-time" },
                        },
                      },
                    },
                    publicUrl: { type: "string", nullable: true },
                    publicUrlExpiration: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/gifts": {
      post: {
        tags: ["Gift"],
        summary: "Create a gift",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  eventId: { type: "integer" },
                },
                required: ["name", "eventId"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Gift created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                    eventId: { type: "integer" },
                    isReserved: { type: "boolean" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/gifts/{id}": {
      put: {
        tags: ["Gift"],
        summary: "Update a gift",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                },
                required: ["name"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Gift updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                    eventId: { type: "integer" },
                    isReserved: { type: "boolean" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Gift"],
        summary: "Delete a gift",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "204": {
            description: "Gift deleted",
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/gifts/{id}/reserve": {
      post: {
        tags: ["Gift"],
        summary: "Reserve a gift",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                },
                required: ["name", "email"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Reservation code sent",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/public/gifts/reserve/confirm": {
      post: {
        tags: ["Public"],
        summary: "Confirm gift reservation",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  code: { type: "string", minLength: 6, maxLength: 6 },
                },
                required: ["email", "code"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Reservation confirmed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/public/gifts": {
      get: {
        tags: ["Public"],
        summary: "Get gifts for slideshow",
        responses: {
          "200": {
            description: "List of public gifts",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      name: { type: "string" },
                      eventTitle: { type: "string" },
                      eventId: { type: "integer" },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
