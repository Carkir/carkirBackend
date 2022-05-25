

time()


function time (){
    var now = new Date()
    var open = new Date()
    var close = new Date()

    now.setFullYear(2022,5,22)
    now.setHours(00,00)
    open.setFullYear(2022,5,22)
    open.setHours(7,0)
    close.setFullYear(2022,5,22)
    close.setHours(23,00)

    if(open.getTime() <now.getTime() && close.getTime() > now.getTime()){
        console.log('open')
    }
    if(close.getTime() < now.getTime()){
        console.log('close')
    }

}