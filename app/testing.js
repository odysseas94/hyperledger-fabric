import axios from "axios";
try{

    axios.post('http://origin-roots.eu:3000/check', {
        id: 'Asset1',

    }).then(function (value) {
        console.log(value);
    }).catch((e)=>{
        console.log(e);
    });


}
catch(e) {

    console.log(e);

}