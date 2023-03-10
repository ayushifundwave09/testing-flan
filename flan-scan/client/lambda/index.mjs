//var AWS = require('aws-sdk');
import AWS from "aws-sdk";

import { verifyToken } from "./authentication.js";
import { serverError, unauthorised } from "./utils/index.js";
export const handler = async (event) => {
  const bucketParams = { Bucket: "mydemobuket" };
  let data;

  AWS.config.update({ region: "ap-south-1" });

  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

  let path = event.requestContext.http.path.slice(1);

  const unauthorizedPaths = ["login", "loginRedirect", "", "/", "index.html"];
  const allowUnauthorizedAccess = (path) => unauthorizedPaths.includes(path) || path.startsWith("view");

  // call S3 to retrieve the website configuration for selected bucket
  try {
    if (!allowUnauthorizedAccess(path)) {
      const tokenString = event.headers["authorization"] ? event.headers["authorization"] : "";
      const token = tokenString.replace("Bearer ", "");
      const user = await verifyToken(token);

      if (user === null) {
        if (event.queryStringParameters?.api) return { status: 403 };
        return unauthorised;
      }
    }

    if (event.queryStringParameters?.api) {
      let Prefix = path;
      let Delimiter = path + "/";
      data = await s3.listObjectsV2({ ...bucketParams, Prefix, Delimiter }).promise();
      data = JSON.stringify(data);
      return {
        statusCode: 200,
        body: data,
      };
    } else {
      if (path === "loginRedirect") {
        const token = (event.queryStringParameters?.id_token ? event.queryStringParameters?.id_token : "").replace(/\"/g, "");

        const user = await verifyToken(token);

        if (user === null) return unauthorised;

        let Key = `${path}/index.html`;

        data = await s3.getObject({ ...bucketParams, Key }).promise();
        data = data.Body.toString("utf-8");

        return {
          statusCode: 200,
          body: data,
          headers: {
            "content-type": "text/html; charset=utf-8",
          },
        };
      }

      const Key =
        path === "login"
          ? `${path}/index.html`
          : path === "" || path === "/" || !path
          ? "index.html"
          : path === "view" || path.startsWith("view")
          ? "view.html"
          : decodeURIComponent(path);

      data = await s3.getObject({ ...bucketParams, Key }).promise();
      data = data.Body.toString("utf-8");

      return {
        statusCode: 200,
        body: data,
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      };
    }
  } catch (error) {
    console.log({ err: error });
    if (error.message == 403) return unauthorised;
    else if (error.message == 401) return unauthorised;
    else if (error.message == 400) return unauthorised;
    else return serverError;
  }
};
