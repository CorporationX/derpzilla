angular.module("chatApp").controller("HomeController", ["$scope", "$location", "socket", "dataFactory",

	function ($scope, $location, socket, dataFactory) {

		$scope.connectedUser = "";
		$scope.currentOpen = {};
		$scope.currentTopic = "Welcome";
		$scope.showRooms = false;
		$scope.inputText = "";

		// Any item that is open (user or room). Identified as Room-roomname or User-username
		// Rooms have a type, name, topic, messages, users 
		// Users have a type, name, "messages" 
		$scope.openItems = {};

		// List of room names
		$scope.rooms = [];

		$scope.getRooms = function () {
			socket.emit("rooms");
		};

		$scope.joinRoom = function (room) {
			var roomObj = {
				room: room
			};

			socket.emit("joinroom", roomObj, function (success, reason) {
				if (success) {

					var ID = "Room-" + roomObj.room;

					var roomItem = {
						type: "Room",
						name: roomObj.room,
						topic: "",
						messages: [],
						users: []
					};

					$scope.openItems[ID] = roomItem;

					$scope.currentOpen = {
						ID: ID
					};

				}
			});
		};

		$scope.sendText = function () {
			if ($scope.inputText && $scope.openItems[$scope.currentOpen.ID].type === "Room") {
				socket.emit("sendmsg", {
					roomName: $scope.openItems[$scope.currentOpen.ID].name,
					msg: $scope.inputText
				}, function (success) {
					if (success) {
						$scope.inputText = "";
					} else {
						console.log("couldnt send message");
					}
				});

				return;
			}


			var msg = {
				message: $scope.inputText,
				nick: $scope.connectedUser
			};


			if ($scope.inputText && $scope.openItems[$scope.currentOpen.ID].type === "User") {
				console.log("sendingprivate");
				socket.emit("privatemsg", {
					nick: $scope.openItems[$scope.currentOpen.ID].chatWith,
					message: $scope.inputText
				}, function (success) {
					if (success) {
						$scope.inputText = "";
						$scope.openItems[$scope.currentOpen.ID].messages.push(msg);
					} else {
						console.log("couldnt send message");
					}
				});
			}
		};

		$scope.privateChat = function (user) {

			if (user === $scope.connectedUser) {
				return;
			}

			var ID = "User-" + user;

			var userObj = {

			};
			userObj[user] = user;
			userObj[$scope.connectedUser] = $scope.connectedUser;


			var userItem = {
				type: "User",
				name: user,
				topic: "Private Chat with " + user,
				messages: [],
				users: userObj,
				chatWith: user
			};

			if (!(ID in $scope.openItems)) {
				$scope.openItems[ID] = userItem;
			}

			$scope.currentOpen = {
				ID: ID
			};


		};

		socket.on("roomlist", function (rooms) {
			// console.log("got roomlist", rooms);
			$scope.rooms = rooms;
		});

		socket.on("updateusers", function (data1, data2, data3) {
			// console.log("updateusers", data1, " - ", data2, " - ", data3);

			var ID = "Room-" + data1;

			if (ID in $scope.openItems) {
				$scope.openItems[ID].users = data2;
			}

		});

		socket.on("updatetopic", function (data1, data2, data3) {

			// console.log("updatetopic", data1, " - ", data2, " - ", data3);

			var ID = "Room-" + data1;

			if (ID in $scope.openItems) {

				$scope.openItems[ID].topic = data2;

			}

		});

		socket.on("recv_privatemsg", function (data1, data2, data3) {
			console.log("recv_privatemsg", data1, " - ", data2, " - ", data3);

			var ID = "User-" + data1;

			var msg = {
				message: data2,
				nick: data1
			};
			var msgs = [];
			msgs.push(msg);

			if (ID in $scope.openItems) {

				$scope.openItems[ID].messages.push(msg);

			} else {


				var userObj = {

				};
				userObj[$scope.connectedUser] = $scope.connectedUser;
				userObj[data1] = data1;

				var userItem = {
					type: "User",
					name: data1,
					topic: "Private Chat with " + data1,
					messages: msgs,
					users: userObj,
					chatWith: data1
				};


				$scope.openItems[ID] = userItem;
			}

		});

		socket.on("servermessage", function (data1, data2, data3) {
			// console.log("servermessage", data1, " - ", data2, " - ", data3);
		});

		socket.on("updatechat", function (data1, data2, data3) {
			console.log("updatechat", data1, " - ", data2, " - ", data3);

			var ID = "Room-" + data1;

			if (ID in $scope.openItems) {

				$scope.openItems[ID].messages = data2;

			}

		});

		$scope.show = function (show) {
			$scope.showRooms = show;
		};

		$scope.open = function (ID) {
			$scope.currentOpen.ID = ID;
		};

		var init = function () {

			$scope.connectedUser = dataFactory.getConnectedUser();

			if (!$scope.connectedUser) {
				$location.path("/login");
			} else {
				$scope.getRooms();

				$scope.joinRoom("lobby");
			}

		};

		init();
	}
]);