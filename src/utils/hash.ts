import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

const hash = async (password: string) =>
  await bcrypt.hash(password, saltOrRounds);

const isMatch = async (password: string, hash: string) =>
  await bcrypt.compare(password, hash);

export { hash, isMatch };
