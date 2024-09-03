import jwt from 'jsonwebtoken';


const JWT_SECRET : string = process.env.JWT_SECRET || "secret_key_collage_world";

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};

export default generateToken;