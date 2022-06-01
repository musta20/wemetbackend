
const initialState = {
    socket: null, //the socket io ini will be stored here
    rtpCapabilities: "", //the rtp infor retrived from the server will be stored here
    isFreeToJoin: false, //the if ther room is avalble to join
    HiddeTheRoom: true, //if the room is hidden from punlic
    Lock: false, //is the room is lock
    device: null, //mediasoup driver will be stoed here
    IsViewer: false, //if the user is viewer or memper of ther room
    isStream: false, //if the room is stream publicly or not
    producerTransport: null, //the proucert transport will be stored here
    consumerTransports: [], //the memper of the room will be stored herer
    producer: null, //if the user procues stream will be stored here
    BossId: 0, //the admin of ther room id will be stord here
    HistoryChat: [], //the chat log will be stored here
    guest: [[], [], [], [], []], //this list will contain the room users
    case: [
      true,
      false,
      false, //the curren case of the view
      false,
      false,
      false,
    ],
    ChatMessage: "", //the value of the chat box
    PrivetMessage: "", //the value of the privet message chat box
    First: false, //the state of the user if admin or not
    // queueGuest:[],              //the queu is a list of new users t prevent dublicate
    ChangeStatVale: [
      //the vlue of the css case classes
      [1, 0, 5, 4, 3, 2, 7, 6],
      [5, 2, 1, 7, 6, 0, 4, 3],
      [6, 7, 3, 2, 5, 4, 0, 1],
    ],
    //the array of class in each cases
    view: [
      [
        "d-none",
        "col-md-6",
        "col-md-4",
        "col-md-4",
        "d-none",
        "d-none",
        "d-none",
        "col-md-4",
      ],
      [
        "d-none",
        "d-none",
        "col-md-3",
        "col-md-2",
        "col-md-3",
        "col-md-4",
        "d-none,d-none",
      ],
      [
        "col-md-7",
        "col-md-6",
        "col-md-5",
        "col-md-4",
        "col-md-6",
        "col-md-6",
        "col-md-6",
        "col-md-5",
      ],
      [
        "d-none",
        "d-none",
        "d-none",
        "col-md-2",
        "col-md-3",
        "d-none",
        "col-md-4",
        "col-md-3",
      ],
    ],
  };
  
  /*
  
     
           [boolead]       [view1  ,     view1     ,  view1  ,   view1  ,]
        view               [    view1        view2       view3       view4]
    case [0] [boolead][view]     x     ||     x     || col-md-6 ||    x  
    case [1] [boolead][view]   col-md-6||     x     || col-md-6 ||    x
    case [2] [boolead][view]   col-md-4||  col-md-3 || col-md-5 ||    x
    case [3] [boolead][view]   col-md-4||  col-md-2 || col-md-4 || col-md-2
    case [4] [boolead][view]      x    ||  col-md-3 || col-md-6 || col-md-3
    case [5] [boolead][view]      x    ||  col-md-4 || col-md-6 ||    x
    case [6] [boolead][view]      x    ||     x     || col-md-6 || col-md-4
    case [7] [boolead][view]  col-md-4 ||     x     || col-md-5 || col-md-3
  
  
    closeCaller(){
  
    view --2
      ---3 set 2
      ---4 set 5
      ---6 set 0
      ---7 set 1
      ---0 set 6
      ---1 set 7
      ---2 set 3
      ---5 set 4
  
    }
  
    shoeCaller(){
    view --1
      ---0 set 5
      ---1 set 2
      ---6 set 4
      ---7 set 3
      ---2 set 1
      ---3 set 7
      ---4 set 6
      ---5 set 0
      }
    ToogleChat(){
      ---0 set 1 
      ---1 set 0
      ---2 set 5 
      ---5 set 2
      ---3 set 4
      ---4 set 3
      ---6 set 7
      ---7 set 6
    }
  
  */
  