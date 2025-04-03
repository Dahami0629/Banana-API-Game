//Save user scores and calculate highest score:https://youtu.be/NSnbUfG3_NY?si=kbjAlNVJtMDERe7H
document.addEventListener("DOMContentLoaded", async () => {
    const leaderboardList = document.querySelector(".leaderboard-list");

    try {
        const querySnapshot = await db.collection("users")
            .orderBy("totalScore", "desc")
            .limit(3)
            .get();

        leaderboardList.innerHTML = "";

        let ranks = ["🥇", "🥈", "🥉"];
        let rankClasses = ["gold-rank", "silver-rank", "bronze-rank"];
        let i = 0;

        querySnapshot.forEach(doc => {
            let data = doc.data();
            let listItem = document.createElement("li");
            listItem.className = rankClasses[i];
            listItem.textContent = `${ranks[i]} ${data.username} - ${data.totalScore} Points`;
            leaderboardList.appendChild(listItem);
            i++;
        });

    } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
    }
});
