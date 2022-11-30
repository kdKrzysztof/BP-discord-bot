
let fetchHandler = {
    createUser: async (bpUsername, discordId) => {
        try {
            await fetch('http://localhost:8080/createUser', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "bpUsername": `${bpUsername}`,
                    "discordId": `${discordId}`
                })
            })
        }  catch(err) {
            console.log(err)
        }
    },
    findDiscordAccount: async (discordId) => {
        try {
            const response = await fetch('http://localhost:8080/findDiscordAccount', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // "bpUsername": `${bpUsername}`
                    "discordId": `${discordId}`
                })
            })
            return response.json()
        }  catch(err) {
            console.log(err)
        }
    },
    findBpUsername: async (bpUsername) => {
        try {
            const response = await fetch('http://localhost:8080/findBpUsername', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "bpUsername": `${bpUsername}`
                    // "discordId": `${discordId}`
                })
            })
            return response.json()
        }  catch(err) {
            console.log(err)
        }
    }
}

export default fetchHandler
