angular.module("chatApp").controller("HomeController", ["$scope", "$location", "socket", "dataFactory",

	function ($scope, $location, socket, dataFactory) {

		//
		// Notes: We only use Homecontroller and home.html now because everything happens on one page and one url
		//


		$scope.connectedUser = "";

		// Keeps the ID of the current open item (Room or Private chat). ID is of the form User-username or Room-roomaname
		$scope.currentOpen = {};

		$scope.currentTopic = "Welcome";

		$scope.newRoomName = "";

		// Used in the html to decide whether to show the list of rooms or a list of users in the current room/chat 
		$scope.showRooms = false;

		$scope.inputText = "";

		// Any item that is open (user or room). Identified as Room-roomname or User-username
		// Rooms have a type, name, topic, messages, users 
		// Users have a type, name, "messages" 
		$scope.openItems = {};

		// Keep the ID of the open tabs because angularjs iterates over objects in alphabetical order
		$scope.openTabs = [];

		// List of room names
		$scope.rooms = {};

		// Get the roomlist
		$scope.getRooms = function () {
			socket.emit("rooms");
		};


		// Join a room. We Create a new object for openItems with the same attributes as described there and also change currentOpen.ID equal
		// to the ID from the object
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

					$scope.openTabs.push(ID);

					$scope.currentOpen = {
						ID: ID
					};

					$scope.getRooms();

				} else {

					if ($scope.rooms[roomObj.room].banned[$scope.connectedUser]) {
						console.log("You are banned fcker !!!");
					}

				}
			});
		};


		// If we are in a room then we just emit sendmsg with the msg because the updatechat event will 
		// arrive later anyways to update our messages
		// But if we are in a private chat then we have to create the message and add it to the 
		// chat we are having in openItems[ID] where ID is User-username
		$scope.sendText = function () {

			if ($scope.inputText && $scope.openItems[$scope.currentOpen.ID].type === "Room") {
				socket.emit("sendmsg", {
					roomName: $scope.openItems[$scope.currentOpen.ID].name,
					msg: $scope.inputText
				});
				$scope.inputText = "";

				return;
			}


			var msg = {
				message: $scope.inputText,
				nick: $scope.connectedUser
			};


			if ($scope.inputText && $scope.openItems[$scope.currentOpen.ID].type === "User") {
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

		// Called when we want to start chatting with someone.
		// If we click on ourselves then we obviously don't do anything but otherwise
		// we need to check whether the conversation has already been opened in openItems[ID]
		// or else we have to create a new object for the conversation in openItems
		$scope.privateChat = function (user) {

			if (user === $scope.connectedUser) {
				return;
			}


			var ID = "User-" + user;

			if ($scope.openTabs.indexOf(ID) > -1) {
				$scope.currentOpen.ID = ID;
				return;
			}

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

			$scope.openTabs.push(ID);


		};

		// Get the roomlist
		socket.on("roomlist", function (rooms) {
			// console.log("got roomlist", rooms);
			$scope.rooms = rooms;
		});

		// User list has been changed in some room - find which room and change the userlist
		socket.on("updateusers", function (data1, data2, data3) {
			console.log("updateusers", data1, " - ", data2, " - ", data3);

			var ID1 = "Room-" + data1;

			if (ID1 in $scope.openItems) {
				$scope.openItems[ID1].users = data2;
				$scope.openItems[ID1].ops = data3;
				return;
			}

			var ID2 = "User-" + data1;

			if (ID2 in $scope.openItems) {
				$scope.openItems[ID2].users = data2;
				$scope.openItems[ID2].ops = data3;
				return;
			}

		});

		// Topic has been changed in some room - find which room and change the topic
		socket.on("updatetopic", function (data1, data2, data3) {

			// console.log("updatetopic", data1, " - ", data2, " - ", data3);

			var ID = "Room-" + data1;

			if (ID in $scope.openItems) {

				$scope.openItems[ID].topic = data2;

			}

		});


		// Private message has been received. 
		// Need to check whether there is already a conversation in the openItems[ID] and then we can just add to the messages
		// else we need to create a new object
		socket.on("recv_privatemsg", function (data1, data2, data3) {
			// console.log("recv_privatemsg", data1, " - ", data2, " - ", data3);

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

				$scope.openTabs.push(ID);
			}

		});

		// TODO
		socket.on("servermessage", function (data1, data2, data3) {
			console.log("recv_privatemsg", data1, " - ", data2, " - ", data3);

			$scope.getRooms();
		});

		socket.on("kicked", function (data1, data2, data3) {
			// console.log("kicked", data1, data2, data3);

			var ID = "Room-" + data1;

			if (ID in $scope.openItems && data2 === $scope.connectedUser) {
				$scope.closeTab(ID);
			}

			$scope.getRooms();

		});

		socket.on("banned", function (data1, data2, data3) {
			console.log("banned", data1, data2, data3);

			var ID = "Room-" + data1;

			if (ID in $scope.openItems && data2 === $scope.connectedUser) {
				$scope.closeTab(ID);
			}

			$scope.getRooms();
		});

		// new chat messages available in some room - need to check whether we have that room open in openItems
		// and add the new messages to openItems[ID].messages
		socket.on("updatechat", function (data1, data2, data3) {
			// console.log("updatechat", data1, " - ", data2, " - ", data3);

			var ID = "Room-" + data1;

			if (ID in $scope.openItems) {

				$scope.openItems[ID].messages = data2;

			}

			$scope.getRooms();

		});

		// Change whether we show rooms or users in the right panel next to the chat
		$scope.show = function (show) {
			$scope.showRooms = show;
		};

		// Used to open one of the tabs that we have open - either a room or a user
		// currently don't have a way to delete tabs
		$scope.open = function (ID) {
			$scope.currentOpen.ID = ID;
		};

		// CLOSE TAB
		$scope.closeTab = function (ID) {

			var index = 0;
			var newIDIndex = 0;

			if ($scope.openItems[ID].type === "Room") {

				index = $scope.openTabs.indexOf(ID);

				var roomName = $scope.openItems[ID].name;

				delete $scope.openItems[ID];

				if ($scope.currentOpen.ID === ID) {
					newIDIndex = index - 1;

					$scope.currentOpen.ID = $scope.openTabs[newIDIndex];
				}

				if (index > -1) {
					$scope.openTabs.splice(index, 1);
				}

				socket.emit("partroom", roomName);


			} else {

				index = $scope.openTabs.indexOf(ID);

				if ($scope.currentOpen.ID === ID) {
					newIDIndex = index - 1;

					$scope.currentOpen.ID = $scope.openTabs[newIDIndex];
				}

				if (index > -1) {
					$scope.openTabs.splice(index, 1);
				}

			}



		};

		$scope.createRoom = function () {

			var tempNewRoomName = $scope.newRoomName.toLowerCase();

			if (tempNewRoomName === "") {
				return;
			}

			if (tempNewRoomName in $scope.rooms) {
				return;
			}

			$scope.joinRoom(tempNewRoomName);

			$scope.newRoomName = "";

		};

		$scope.openChatRoom = function (room) {


			var ID = "Room-" + room;

			var index = $scope.openTabs.indexOf(ID);

			if (index > -1) {
				$scope.currentOpen.ID = ID;
				return;
			}

			$scope.joinRoom(room);
		};

		$scope.ban = function (user) {

			socket.emit("ban", {
				user: user,
				room: $scope.openItems[$scope.currentOpen.ID].name
			}, function (success) {
				$scope.getRooms();
			});

		};

		$scope.kick = function (user) {

			socket.emit("kick", {
				user: user,
				room: $scope.openItems[$scope.currentOpen.ID].name
			});

		};

		// Initialize - get the rooms list and join lobby
		// if not a user then just redirect to loginlin
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