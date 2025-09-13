import cron from "node-cron";
import { User } from '../models/userModel.js';

// The node-cron module is tiny task scheduler in pure JavaScript for node.js based on GNU crontab. 
// This module allows you to schedule task in node.js using full crontab syntax.


// In this case it will run every after 30 minutes and clear the all the not-verified : user (if they are created 30 minute ago.)

export const removeUnverifiedAccounts = () => {
  cron.schedule("*/30 * * * *", async () => {
    const thirtyMinuteAgo = new Date(Date.now() * 30 * 60 * 1000);
        await User.deleteMany({
            accountVerified : false,
            createdAt : {
                $lt : thirtyMinuteAgo
            }
        });
  });
};
