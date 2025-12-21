import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/model/user";
import { dbConnect } from "@/lib/db.Connect";

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
        await dbConnect();

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("Bunday foydalanuvchi topilmadi");

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
    async signIn({ user, account, profile }) {
      try {
        await dbConnect();

        if (account.provider === "google") {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            await User.create({
              email: user.email,
              fullName: user.name || "",
              avatar: user.image || "",
              password: null,
              role: "user"
            });
          }
        }
        return true;
      } catch (error) {
        console.error("Google Login Error:", error);
        return false;
      }
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
                  console.log(`🔒 AUTH DEBUG: User ${token.email} fetched from DB. Role: ${dbUser.role}`);
              } else {
                  console.log("⚠️ AUTH WARNING: User not found in DB during JWT callback:", token.email);
              }
          } catch (error) {
              console.error("❌ AUTH ERROR in JWT User Lookup:", error);
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
