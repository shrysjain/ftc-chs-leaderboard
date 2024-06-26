import axios from 'axios';
import 'dotenv/config';

const API_BASE_URL = 'https://theorangealliance.org/api';
const API_KEY = 'MV0CsKI7QaW6XKGkkqQVjpQFH01Zmc6GKBsxu7kZac0='; // RoP

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-Application-Origin': 'ftc-chs-leaderboard',
        'X-TOA-Key': API_KEY,
    },
});

export const getTeamInfo = async (teamNumber) => {
  try {
    const response = await api.get(`/team/${teamNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching team information:', error);
    throw error;
  }
};