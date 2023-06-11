import { DynamoDB } from "aws-sdk";
import { Result, Ok, Err } from "oxide.ts";
import { z, ZodSchema } from "zod";

export class DbClient<T> {
  private tableName: string;
  private schema: ZodSchema<T>;
  private documentClient: DynamoDB.DocumentClient;

  constructor(schema: ZodSchema<T>, tableName: string) {
    this.schema = schema;
    this.tableName = tableName;
    this.documentClient = new DynamoDB.DocumentClient();
  }

  private validateItem(item: any): Result<T, string> {
    const parsedResult = this.schema.safeParse(item);

    if (!parsedResult.success) {
      console.error(parsedResult.error);
      return Err("error validation item");
    }

    return Ok(parsedResult.data);
  }

  async getItem(key: DynamoDB.DocumentClient.Key): Promise<Result<T, string>> {
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.tableName,
      Key: key,
    };

    try {
      const result = await this.documentClient.get(params).promise();
      return this.validateItem(result.Item);
    } catch (error) {
      console.error("Error retrieving item from DynamoDB:", error);
      return Err("Error retrieving item from DynamoDB");
    }
  }

  async getItems(
    additionalQueryParams?: Partial<DynamoDB.DocumentClient.QueryInput>
  ): Promise<Result<T[], string>> {
    const queryParams: DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      ...additionalQueryParams,
    };

    try {
      const result = await this.documentClient.query(queryParams).promise();
      const itemsResult = z.array(this.schema).safeParse(result.Items ?? []);

      if (!itemsResult.success) {
        console.log("items", result.Items);
        return Err("failed to validate list of items");
      }

      return Ok(itemsResult.data);
    } catch (error) {
      console.error("Error retrieving items from DynamoDB:", error);
      return Err("Error retrieving items from DynamoDB");
    }
  }

  async putItem(item: T): Promise<Result<T, string>> {
    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: item as DynamoDB.DocumentClient.PutItemInputAttributeMap,
    };

    try {
      await this.documentClient.put(params).promise();
      return Ok(item);
    } catch (error) {
      console.error("Error putting item into DynamoDB:", error);
      return Err("Error putting item into DynamoDB");
    }
  }

  async updateItem<K extends keyof T>(
    key: DynamoDB.DocumentClient.Key,
    updates: Partial<Pick<T, K>>
  ): Promise<Result<T, string>> {
    const expressionAttributeNames: DynamoDB.DocumentClient.ExpressionAttributeNameMap =
      {};

    const expressionAttributeValues: DynamoDB.DocumentClient.ExpressionAttributeValueMap =
      {};

    let updateExpression = "SET";

    for (const attr in updates) {
      const paramName = `:${attr}`;
      const attrName = `#${attr}`;

      expressionAttributeNames[attrName] = attr;
      expressionAttributeValues[paramName] = updates[attr];
      updateExpression += ` ${attrName} = ${paramName},`;
    }

    updateExpression = updateExpression.slice(0, -1); // Remove the trailing comma

    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: this.tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    };

    try {
      const result = await this.documentClient.update(params).promise();
      const updatedItem = result.Attributes as T;
      return Ok(updatedItem);
    } catch (error) {
      console.error("Error updating item in DynamoDB:", error);
      return Err("Error updating item in DynamoDB");
    }
  }

  async deleteItem(
    key: DynamoDB.DocumentClient.Key
  ): Promise<Result<void, string>> {
    const params: DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: this.tableName,
      Key: key,
    };

    try {
      await this.documentClient.delete(params).promise();
      return Ok(undefined);
    } catch (error) {
      console.error("Error deleting item from DynamoDB:", error);
      return Err("Error deleting item from DynamoDB");
    }
  }
}
