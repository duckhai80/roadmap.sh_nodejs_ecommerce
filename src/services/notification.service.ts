import { notificationModel } from "@/models";
import { Notification } from "@/models/notification.model";
import { convertToObjectId } from "@/utils";
import { _QueryFilter } from "mongoose";

class NotificationService {
  static pushToSystem = async ({
    type = "SHOP_001",
    senderId = "1",
    receiverId = "1",
    options = {},
  }: {
    type: string;
    senderId: string;
    receiverId: string;
    options: any;
  }) => {
    let content;

    switch (type) {
      case "SHOP_001":
        content = `@@@ has created new product @@@@`;
        break;
      case "PROMOTION_001":
        content = `@@@ has created new promotion @@@@`;
        break;
      default:
        content = "";
        break;
    }

    const newNotification = await notificationModel.create({
      type,
      senderId: convertToObjectId(senderId),
      // receiverId: convertToObjectId(receiverId),
      receiverId,
      content,
      options,
    });

    return newNotification;
  };

  static findAllByUserId = async ({
    userId = "1",
    type = "ALL",
    isRead = 0,
  }) => {
    const match: _QueryFilter<Notification> = {
      receiverId: userId,
    };

    if (type !== "ALL") {
      match["type"];
    }

    return notificationModel.aggregate([
      {
        $match: match,
      },
      {
        $project: {
          type: 1,
          senderId: 1,
          receiverId: 1,
          content: {
            $concat: [
              {
                $substr: ["$options.shopId", 0, -1],
              },
              " has created new product: ",
              {
                $substr: ["$options.productName", 0, -1],
              },
            ],
          },
          options: 1,
          createdAt: 1,
        },
      },
    ]);
  };
}

export default NotificationService;
