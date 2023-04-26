import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT;

let fetchHandler = {
  createUser: async (bpUsername, discordId) => {
    try {
      await fetch(`http://localhost:${port}/createUser`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bpUsername: `${bpUsername}`,
          discordId: `${discordId}`
        })
      });
    } catch (err) {
      console.log(err);
    }
  },
  findDiscordAccount: async (discordId) => {
    try {
      const response = await fetch(`http://localhost:${port}/findDiscordAccount`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // "bpUsername": `${bpUsername}`
          discordId: `${discordId}`
        })
      });
      return response.json();
    } catch (err) {
      console.log(err);
    }
  },
  findBpUsername: async (bpUsername) => {
    try {
      const response = await fetch(`http://localhost:${port}/findBpUsername`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bpUsername: `${bpUsername}`
          // "discordId": `${discordId}`
        })
      });
      return response.json();
    } catch (err) {
      console.log(err);
    }
  },
  removeDiscordId: async (discordId) => {
    try {
      const response = await fetch(`http://localhost:${port}/removeDiscordId`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          discordId: `${discordId}`
        })
      });
      return response.json();
    } catch (err) {
      console.log(err);
    }
  }
};

export default fetchHandler;
