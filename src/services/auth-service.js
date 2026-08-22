import userRepository from "../repositories/user-repository.js";
import bcrypt from "bcrypt";

async function login(email, password) {
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw new Error('Невалиден имейл или парола');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Невалиден имейл или парола');
    }

    return user;
}

export default {
    login,
};