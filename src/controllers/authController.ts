import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { z } from 'zod';
import { signinSchema, signupSchema } from '../validation/validation';

export const signup = async (req: Request, res: Response) => {
  try {
    const data = signupSchema.parse(req.body);
    const { user, token } = await authService.signup(
      data.email,
      data.password,
      data.name,
      'USD'
    );
    res.status(201).json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: (error as Error).message });
    }
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const data = signinSchema.parse(req.body);
    const { user, token } = await authService.signin(data.email, data.password);
    res.status(200).json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(401).json({ error: (error as Error).message });
    }
  }
};
