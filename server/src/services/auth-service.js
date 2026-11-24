import userRepository from "../repositories/user-repository.js";
import bcrypt from "bcrypt";

// Ако няма такъв имейл, пак проверяваме парола срещу този хеш,
// за да отнеме толкова време, колкото и при грешна парола –
// така по времето на отговора не може да се познае кои имейли съществуват.
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', 10);

// Връща потребителя при правилни данни или null при грешни.
async function login(email, password) {
    const user = await userRepository.findUserByEmail(email);
    const isPasswordValid = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);

    if (!user || !isPasswordValid) {
        return null;
    }

    return user;
}

// При подновяване на сесията проверяваме, че акаунтът още е админ.
async function getActiveAdmin(id) {
    const user = await userRepository.findUserById(id);

    return user?.role === 'ADMIN' ? user : null;
}

export default {
    login,
    getActiveAdmin,
};
