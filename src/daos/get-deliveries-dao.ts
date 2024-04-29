import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Delivery } from './models/delivery';
import { singleton } from 'tsyringe';
import { ThirdPartyApps } from '../third-party-apps';

@singleton()
export class GetDeliveriesDao {
  public async getDeliveryById(deliveryId: string): Promise<Delivery | null> {
    // Create a command to get item
    const getItemCommand = new GetItemCommand({
      TableName: 'Deliveries',
      Key: marshall({
        deliveryId: deliveryId,
      }), // Marshal the key
    });

    // Send the command to DynamoDB
    const { Item } = await ThirdPartyApps.getInstance().ddbClient.send(getItemCommand);

    // Unmarshal the returned item
    return Item ? unmarshall(Item) as Delivery : null;
  }
}
