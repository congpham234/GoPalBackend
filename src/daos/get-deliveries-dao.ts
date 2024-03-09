import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Delivery } from './models/delivery';
import { Service } from 'typedi';
import { ddbClient } from '../middlewares/dynamodb-connection';

@Service()
export class GetDeliveriesDao {
  public async getDeliveryById(deliveryId: string, orderId: string): Promise<Delivery | null> {
    try {
      // Create a command to get item
      const getItemCommand = new GetItemCommand({
        TableName: 'Deliveries',
        Key: marshall({
          DeliveryId: deliveryId,
          OrderId: orderId,
        }), // Marshal the key
      });

      // Send the command to DynamoDB
      const { Item } = await ddbClient.send(getItemCommand);

      // Unmarshal the returned item
      return Item ? unmarshall(Item) as Delivery : null;
    } catch (err: any) {
      throw err;
    }
  }
}
