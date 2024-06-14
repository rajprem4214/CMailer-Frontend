import jwt from 'jsonwebtoken';

const SignToken = async (email: any) => {
    const token = await jwt.sign({ id: email }, process.env.NEXT_PUBLIC_JWT_SECRET_KEY!, { expiresIn: '1d' });
    return token
}

export default SignToken;