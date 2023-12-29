mergeInto(LibraryManager.library,
{	
	let ysdk;
    Initialize: function (params) {
      YaGames
      .init(params)
      .then(_sdk => {
        ysdk = _sdk;
        console.log("YandexGamesSDK initialized");
      })
      .catch(console.error);
    }
});