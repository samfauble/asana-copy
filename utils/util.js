const nameIdKey = (objectList, toBecomeIdKey) => {
    objectList.map((user) => {
        Object.defineProperty(user, 'id',
        Object.getOwnPropertyDescriptor(user, toBecomeIdKey));
        delete user[toBecomeIdKey];
      })
}


module.exports = {
    nameIdKey 
}
