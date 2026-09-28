import { Box, Typography } from "@mui/material";
import { useEffect } from "react";

import backgroundMap from "../../assets/images/backgroundMap.webp";
import { useBackground } from "../../context/BackgroundContext/BackgroundContext";

import {
  privacyContent,
  privacyHeading,
  privacyOverlay,
  privacyText,
  privacyTitle,
  privacyWrapper,
} from "./privacyPolicy.style";

const OWNER_NAME = "Adrian Żołnierczyk";
const CONTACT_EMAIL = "adrian.mamyto@gmail.com";
const LAST_UPDATED = "September 28, 2026";

const sections = [
  {
    title: "Who we are",
    body: [
      `Queue Quiz is a fan-made quiz game run by ${OWNER_NAME}, who is the controller of your personal data. You can reach us at ${CONTACT_EMAIL}.`,
    ],
  },
  {
    title: "What data we collect",
    body: [
      "Account data: your email address and, if you sign in with Google, the basic profile data Google shares with us.",
      "Profile data you provide: username, first name, last name and the avatar you choose from the ones we provide.",
      "Game data: your scores, ranking position and PvP match history.",
      "We do not use analytics or advertising cookies.",
    ],
  },
  {
    title: "Why we use it",
    body: [
      "We use your data only to run the game: to create and secure your account, save your progress and show the public leaderboard. The legal basis is the performance of our service for you (Art. 6(1)(b) GDPR).",
      "Your username, avatar and scores are visible to other players. Your email and name are not.",
    ],
  },
  {
    title: "Who processes it",
    body: [
      "Your account and game data are stored with Google Firebase (Authentication and Firestore), and the game logic runs on Google Cloud Functions. The website is hosted by Vercel, which processes your IP address and request logs to deliver it. These providers act as our processors, and some data may be processed outside the EEA under their standard contractual clauses.",
      "Game content such as champion data and images is loaded from Riot Games' Data Dragon service, which may see your IP address.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "We keep your data while your account exists. You can delete your account at any time from your dashboard, which removes your profile, your scores and any pending matchmaking entry.",
      "Records of Player vs Player matches you played keep the usernames of both players.",
    ],
  },
  {
    title: "Your rights",
    body: [
      `You have the right to access, correct, delete and export your data, to object to its processing and to lodge a complaint with a supervisory authority (in Poland: the President of the Personal Data Protection Office, UODO). To exercise these rights, contact ${CONTACT_EMAIL}.`,
    ],
  },
  {
    title: "Browser storage",
    body: [
      "We use your browser's local and session storage only to keep you signed in and remember the current background image. These are strictly necessary and require no consent.",
    ],
  },
];

const PrivacyPolicy = () => {
  const { setImage } = useBackground();

  useEffect(() => {
    setImage(backgroundMap);
    return () => setImage(undefined);
  }, [setImage]);

  return (
    <Box sx={privacyWrapper}>
      <Box sx={privacyOverlay}>
        <Box sx={privacyContent}>
          <Typography component="h1" sx={privacyTitle}>
            Privacy Policy
          </Typography>
          <Typography sx={privacyText}>Last updated: {LAST_UPDATED}</Typography>
          {sections.map(({ title, body }) => (
            <Box key={title}>
              <Typography component="h2" sx={privacyHeading}>
                {title}
              </Typography>
              {body.map((paragraph) => (
                <Typography key={paragraph} sx={privacyText} mt={1}>
                  {paragraph}
                </Typography>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PrivacyPolicy;
