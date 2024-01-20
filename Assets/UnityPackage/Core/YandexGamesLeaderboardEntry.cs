using System;

namespace YandexGamesPlugin.Core
{
    [Serializable]
    public class YandexGamesLeaderboardEntry
    {
        public Int32 Rank;
        public String Username;
        public Int32 Score;
        public Boolean IsPlayerEntry;
    }
}