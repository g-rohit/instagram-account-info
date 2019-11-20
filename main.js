function err() {
  $(".error").show();
  document.querySelector(".error").innerText = "Please enter a valid username";
}

function displayAccountDetails() {
  let uname = $("#instaUsername").val();

  if (uname == "") {
    console.log("username is empty");
    $(".accountDetails").hide();
    return err();
  } else {
    let accounturl = "https://www.instagram.com/" + uname + "/?__a=1";
    // console.log(accounturl);
    fetch(accounturl)
      .then(function (response) {
        // The JSON data will arrive here

        //if the name is not valid, throw an error
        if (response.status == 404 || response.status == 400) {
          $(".accountDetails").hide();
          $(".error")
            .show()
            .html("User Doesn't Exist");

          //else proceed to get the response json data
        } else {
          return response.json();
        }
      }) //once the data is succesfully pulled its then appended into object named instagram
      .then(function (instagram) {
        if (instagram.graphql.user.is_private == true) {
          console.log("private");
          $(".accountDetails").hide();
          $(".error")
            .show()
            .html("This account is Private");
        } else {
          appendData(instagram);
        }
      })
      // if anything goes wrong we can check the err msg thru catch
      .catch(function (err) {
        console.log("Error: " + err);
        // $(".error").show().html("Oops something went wrong, try again");
      });

    function appendData(instagram) {
      $(".error").hide();

      $("#dp").html(
        '<img src="' +
        instagram.graphql.user.profile_pic_url_hd +
        '" alt="' +
        instagram.graphql.user.username +
        "'s Profile pic\"  >"
      );

      $("#username").html("<b>@" + instagram.graphql.user.username + "<b>");
      $("#FullName").html("<b>" + instagram.graphql.user.full_name + "<b>");
      $("#followers").html(
        "<b>" + instagram.graphql.user.edge_followed_by.count + "<b>"
      );
      $("#following").html(
        "<b>" + instagram.graphql.user.edge_follow.count + "<b>"
      );

      if (instagram.graphql.user.biography == null) {
        $("#bio")
          .html(instagram.graphql.user.biography)
          .hide();
      } else {
        $("#bio").html(instagram.graphql.user.biography);
      }

      if (instagram.graphql.user.external_url == null) {
        $("#website").hide();
      } else {
        $("#website").show();
        $("#website").html(
          "Website: \n" + "<b>" + instagram.graphql.user.external_url + "<b>"
        );
      }

      $("#totalPostsUploaded").html(
        "<b>" +
        instagram.graphql.user.edge_owner_to_timeline_media.count +
        "<b>"
      );

      let profileURL =
        "https://instagram.com/" + instagram.graphql.user.username;
      $("#visitProfile")
        .prop({
          href: profileURL,
          title: "Opens in a new window"
        })
        .click(function () {
          window.open(this.href);
          return false;
        });

      if (instagram.graphql.user.edge_owner_to_timeline_media.count == 0) {
        console.log("No posts");
        $("#latestPost").hide();
      } else {
        var url =
          instagram.graphql.user.edge_owner_to_timeline_media.edges[0].node
            .display_url;
        $("#latestPost").show();
        $("#latestPost").html(
          "Latest Post thumbnail: \n" +
          '<img src="' +
          url +
          '" alt="' +
          instagram.graphql.user.username +
          "'s Latest Post\"  >"
        );
      }

      $(".accountDetails").show();
    }
  }
}




// Insta post download:




let getHDimage = function () {
  let userInputURL = $("#userInputURL").val();
  let trim = userInputURL.substring(0, 40);
  if (userInputURL == "") {
    $(".error2")
      .show()
      .html("Please enter a valid post url");
  } else {
    let HdImageURL = "media/?size=l";
    let full = trim + HdImageURL;
    (async () => {
      const response = await fetch(full);
      // console.log(response.url);

      $("#imageDLURL").html('<img src="' +
        response.url +
        '" alt="' + "'s Latest Post\"  >"
      );

      ('<img src=' + response.url > '');

      $('<a/>')
      .addClass('btn-long download-btn')
      .attr({
        'href': response.url,
        'target': '_blank',
        download : true
      })
      .text('Download image')
      .appendTo('#imageDLURL');
      
      ;

    })();
$("#userInputURL").val("");

    // console.log(response.url);
    // return window.open(response.url);

  }

}

