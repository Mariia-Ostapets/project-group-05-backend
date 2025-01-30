import { UsersCollection } from '../db/models/user.js';

export const findUserById = (userId) => UsersCollection.findById(userId);
