const Item = require('../models/tempatModels')
const formatDate = require('date-and-time')
const fs = require('fs')

async function updateInfo(tempatParkir,hourOpen,hourClose,minuteOpen,minuteClose,priceHigh,priceLow,alamat,image){
    console.log('CALLED!')
    const timeClose = new Date()
    const timeOpen = new Date()
    
    timeClose.setFullYear(2022,5,24)
    timeClose.setHours(hourClose,minuteClose)
    timeOpen.setFullYear(2022,5,24)
    timeOpen.setHours(hourOpen,minuteOpen)

    const timeOpenFormat = formatDate.format(timeOpen,'HH:mm')
    const timeCloseFormat = formatDate.format(timeClose,'HH:mm')  
    console.log(image)

    try{
        await Item.updateOne({tempatParkir:tempatParkir},{
            $set:{
                timeOpen: timeOpen.getTime(),
                timeClose: timeClose.getTime(),
                priceHigh: priceHigh,
                priceLow: priceLow,
                alamat : alamat,
                time: `${timeOpenFormat} WIB - ${timeCloseFormat} WIB`,
                image: image
            }
        })
    }catch(error){
        console.log(error)
        return
    }
}

module.exports = {updateInfo}





