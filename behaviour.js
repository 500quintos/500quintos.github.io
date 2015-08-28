var firebaseRef = 'https://500quintos.firebaseio.com/users';
var me = null;
jQuery.extend(jQuery.validator.messages, {
  required: "Este campo es obligatorio.",
  email: "Porfavor, usa un email válido."
});

$.validator.addMethod('filesize', function(value, element, param) {
  // param = size (en bytes)
  // element = element to validate (<input>)
  // value = value of the element (file name)
  return this.optional(element) || (element.files[0].size <= param)
});



$('#register').validate({
  rules: { inputimage: { required: true, accept: "png|jpe?g|gif", filesize: 1048576  }},
  messages: { inputimage: "La imagen ha de ser JPG, GIF o PNG, de menos de 1MB" }
});



$(document).ready(function(){
  var f;
  var reader;
  var filePayload;

  $("#video").attr("src", "https://www.youtube.com/embed/Kq776HAoJSA?rel=0");

  $("#myTabs a").click(function(event){
    event.preventDefault();
    $("#myTabs .active").removeClass("active");
    $(this).parent().addClass("active");
    var activate_div = $(this).data("toggle");
    $("#myTabs").parent().find("> div").hide();

    $("#"+activate_div).show();
  });

  $(".guardar").click(function(event){

    event.preventDefault();

    me.bio = $("#bio").val();

    if(filePayload){
      me.foto = filePayload;
    }

    var usersRef = new Firebase(firebaseRef+'/'+me.nombre);

    usersRef.set(me, function(){
      alert('guardado');
    });
  });

  $('.foto').change(function(event){
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function(){
      filePayload = reader.result;
    };
    reader.readAsDataURL(input.files[0]);
  });

  $("#login").submit(function(event){

    event.preventDefault();
    var usersRef = new Firebase(firebaseRef);
    var _name = $(this).find('input[name=nombre]').val().toLowerCase();
    var _password = $(this).find('input[name=password]').val();

    if($('#login').valid()){
      usersRef.child(_name).once('value', function(snapshot) {
        if(snapshot.val() !== null && snapshot.val().password == _password){

          me = snapshot.val();

          var foto = me.foto || "placeholder.jpg";
          $(".my-data").find(".avatar").attr("src", foto);
          $(".my-data").find(".name").text(me.nombre);
          $("#chat-title b").text(me.nombre);
          $(".signup").remove();
          $(".my-data").show();
          $(".inscritos").show();
          usersRef.once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              var key = childSnapshot.key();
              var childData = childSnapshot.val();
              var foto = childData.foto || "placeholder.jpg";
              $(".inscritos .row").append('<div class="col-xs-12 col-sm-6 col-md-3"><img src="'+foto+'"><p>'+childData.nombre+'</p></div>')
            });
          });

        }else{

            var $validator = $("#login").validate();
            errors = { password: 'credenciales incorrectas' };
            $validator.showErrors(errors);

        }
      });
    }



  });

  $('#register').submit(function(event){
    event.preventDefault();
    if($('#register').valid()){

      var _name = $(this).find('input[name=nombre]').val().toLowerCase();
      var _email = $(this).find('input[name=email]').val();
      var _password = $(this).find('input[name=password]').val();

      var usersRef = new Firebase(firebaseRef);

      usersRef.child(_name).once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);

        if(!exists){

          var url = firebaseRef + '/' + _name;
          var f = new Firebase(url);
          user = {
            nombre: _name,
            email: _email,
            password: _password,
          };
          if(filePayload){
            user.foto = filePayload;
          }
          console.log(user);
          f.set(user, function(){
            alert('guardado');
          });
        }else{
          var $validator = $("#register").validate();
          errors = { nombre: 'este nombre está siendo usado, por favor escoge otro' };
          $validator.showErrors(errors);
        }
      });
    }
  });

});
