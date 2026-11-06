import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/model/user";
import { dbConnect } from "@/lib/db.Connect";
import { ensureGoogleUser, resolveGoogleSignIn } from "@/lib/google-account.mjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Parol", type: "password" },
      },
      async authorize(credentials) {
        if (typeof credentials?.email !== "string" || typeof credentials?.password !== "string") return null;
        await dbConnect();
        const user = await User.findOne({ email: credentials.email.trim().toLowerCase() });
        if (!user?.password) throw new Error("Bunday foydalanuvchi topilmadi");

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) throw new Error("Parol noto‘g‘ri");

        // Return object expected by NextAuth
        return {
            id: user._id.toString(),
            name: user.fullName || user.email,
            email: user.email,
            image: user.avatar,
            role: user.role
        };
      },
    }),
  ],
  
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      return resolveGoogleSignIn(account, user, () => ensureGoogleUser(user));
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        // Login paytida (birinchi marta)
        token.id = user.id; 
      }
      
      // Har safar tokenni yangilaganda bazadan _id ni tekshirish
      if (token.email) {
          try {
              await dbConnect();
              const dbUser = await User.findOne({ email: token.email });
              if (dbUser) {
                  token.id = dbUser._id.toString();
                  token.role = dbUser.role; 
              } else {
                  delete token.id;
                  delete token.role;
              }
          } catch (error) {
              delete token.id;
              delete token.role;
              console.error("Sessiyani yangilab bo‘lmadi");
          }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Agar logout qilinsa (callbackUrl: '/'), asosiy sahifaga qaytarish
      if (url === "/" || url === baseUrl) {
        return baseUrl;
      }
      // Google Login yoki boshqa loginlardan keyin asosiy sahifaga ("/") qaytarish
      // U yerdan app/page.js role bo'yicha yo'naltiradi
      return baseUrl;
    },
  },

  pages: {
    signIn: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
