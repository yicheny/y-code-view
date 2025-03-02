try{
    console.log(error());
}catch ( e ){
    console.error('报错',e);
}

function error(){
    throw new Error('error')
}
