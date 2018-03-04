/********************************************************************************
 Firebase JS file to be used across the project. Contains all init and dat fetch 
 routines
*********************************************************************************/

var db;
var temp;
var my_clouddata_instance =
{
    datacount : 1,
    lastVisible : 0
}

function myfirebase_init( )
{
    var config = {
        apiKey: "AIzaSyCA0RlvgN4ZLba2uAuCi3hgZDd0RHpmGJY",
        authDomain: "wishpix-5fff8.firebaseapp.com",
        databaseURL: "https://wishpix-5fff8.firebaseio.com",
        projectId: "wishpix-5fff8",
        storageBucket: "wishpix-5fff8.appspot.com",
        messagingSenderId: "281863013543"
      };
      firebase.initializeApp(config);
      console.log("myfirebase_init initiazed");
      db = firebase.firestore();
      console.log("Persistance enabled"+db);
      firebase.firestore().enablePersistence()
      .then(function() {
          // Initialize Cloud Firestore through firebase
          
    
      })
      .catch(function(err) {
          if (err.code == 'failed-precondition') {
              // Multiple tabs open, persistence can only be enabled
              // in one tab at a a time.
              // ...
              console.log("failed-precondition");
          } else if (err.code == 'unimplemented') {
              // The current browser does not support all of the
              // features required to enable persistence
              // ...
              console.log("unimplemented");
          }
      });

}

function myfirestore_getdata (collection,req_size,content_array)
{
    var imagecollectionbydate;
    /*
    db.collection("wishimages").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
        });
    });
    */
    /* Get first data */
    if ( my_clouddata_instance.lastVisible == 0 )
    imagecollectionbydate = db.collection("wishimages").orderBy("created-time").limit(req_size);
    else 
    imagecollectionbydate = db.collection("wishimages").orderBy("created-time")
                            .startAfter( my_clouddata_instance.lastVisible).limit(req_size);
    
  /*
        imagecollectionbydate.onSnapshot((snapshot) => {
        my_clouddata_instance.lastVisible = snapshot.docs[snapshot.docs.length-1];
        console.log(" The size of received data " + snapshot.size);
        snapshot.forEach((doc) => {
          console.log(doc.data());
        });
    });
    */
    imagecollectionbydate.get().then(function(querySnapshot) {
        temp = querySnapshot.docs[querySnapshot.docs.length-1];
        
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            var data = new Object();
            data.timestamp = doc.get("created-time");
            data.imagelink = doc.get("link-hdpi");
            console.log(data.timestamp + data.imagelink );
            content_array.push(data);
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    myfirestore_newdataind();
}

function myfirestore_newdataind( )
{
    db.collection("dataupdated").onSnapshot(function (querySnapshot) {
      console.log(" New data is available");

    });

}
