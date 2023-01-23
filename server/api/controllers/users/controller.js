import UsersService from '../../services/users.service';
import MailerService from '../../services/mailer.service';
import Cloudinary from 'cloudinary';
import fs from 'fs';
import xss from 'xss';

import { xssOptions } from '../../../common/config';

export class Controller {
  async login(req, res, next) {
    try {
      const { roll, password } = req.body;
      const token = await UsersService.login(roll, password);
      res
        .status(200)
        .json({ token: token, message: 'Successfully Logged in!' });
    } catch (err) {
      next(err);
    }
  }

  async getUserDetails(req, res, next) {
    try {
      const { roll } = req.user;
      const { user, rank, achievements } = await UsersService.getUserDetails(
        roll
      );
      res.status(200).json({
        user,
        rank,
        achievements,
        message: 'Details successfully fetched',
      });
    } catch (err) {
      next(err);
    }
  }

  async getLeaderboard(req, res, next) {
    try {
      const { cursor } = req.query;
      const { leaderboard, totalScore } = await UsersService.getLeaderboard(
        parseInt(cursor)
      );
      res.status(200).json({
        leaderboard,
        totalScore,
        message: 'Leaderboard successfully fetched',
      });
    } catch (err) {
      next(err);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { roll } = req.user;
      let { currentPassword, newPassword } = req.body;

      currentPassword = xss(currentPassword, xssOptions);
      newPassword = xss(newPassword, xssOptions);
      if (!currentPassword || !newPassword)
        throw { status: 400, message: 'Invalid Password' };

      await UsersService.changePassword(roll, currentPassword, newPassword);
      res.status(200).json({ message: 'Password successfully changed!' });
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { roll } = req.body;

      await UsersService.forgotPassword(roll);
      res.status(200).json({ message: 'Reset Email Sent Successful!' });
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req, res, next) {
    try {
      let { roll, otp, newPassword, confirmPassword } = req.body;

      newPassword = xss(newPassword, xssOptions);
      confirmPassword = xss(confirmPassword, xssOptions);
      if (!newPassword || !confirmPassword)
        throw { status: 400, message: 'Invalid Password' };

      if (newPassword !== confirmPassword) {
        res.status(400).json({ message: 'Password does not match!' });
      }
      await UsersService.resetPassword(roll, otp, newPassword);
      res.status(200).json({ message: 'Password Reset Successful!' });
    } catch (err) {
      next(err);
    }
  }
  async changeProfilePicture(req, res, next) {
    try {
      const { roll } = req.user;

      if (!req.file?.path)
        throw { status: 400, message: 'Invalid Profile Picture' };

      const filePath = req.file.path;

      const url = await Cloudinary.v2.uploader
        .upload(filePath, { folder: 'dps/', public_id: req.file.name })
        .then(result => {
          fs.unlinkSync(filePath);
          return result.url;
        })
        .catch(error => {
          fs.unlinkSync(filePath);
          throw error;
        });

      const updatedUser = await UsersService.changeProfilePicture(roll, url);
      res.status(200).json({
        user: updatedUser,
        message: 'Profile Picture Successfully Changed',
      });
    } catch (err) {
      next(err);
    }
  }

  async changeFcmToken(req, res, next) {
    try {
      req.body.fcmToken = xss(req.body.fcmToken, xssOptions);
      if (!req.body.fcmToken)
        throw { status: 400, message: 'Invalid FCM Token!' };

      await UsersService.changeFcmToken(req.user.roll, req.body.fcmToken);
      res.status(200).json({ message: 'Successfully updated FCM Token' });
    } catch (err) {
      next(err);
    }
  }

  async sendSuggestion(req, res, next) {
    try {
      const { suggestion, anonymous } = req.body;

      await MailerService.sendSuggestion(
        suggestion,
        anonymous ? null : req.user.roll
      );
      res.status(200).json({ message: 'Successfully sent suggestion' });
    } catch (err) {
      next(err);
    }
  }
}
export default new Controller();
