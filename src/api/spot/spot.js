const router = require('express').Router();
const http = require('http');
const db_mysql = require('../../config')

const fs = require('fs')

// const ids = []
const insert_spot = 'INSERT INTO spots(identify, name, zipcode, lat, lon, structure, altitude, last_update) VALUES (?)'
const insert_practice = 'INSERT INTO pratices(name) VALUES (?)'
const insert_orientation = 'INSERT INTO orientation(name, lvalue, rvalue) VALUES (?)'
const spot_to_orientation = 'INSERT INTO spot_orientation(spot_identity, orientation_id) VALUES (?)'
const spot_to_practice = 'INSERT INTO spot_pratice(spot_identity, practice_id) VALUES (?)'

const CardinalPoint = [
    ["N", [348.75, 11.25]],
    ["NNE", [11.25, 33.75]],
    ["NE", [33.75, 56.25]],
    ["ENE", [56.25, 78.75]],
    ["E", [75.75, 101.25]],
    ["ESE", [101.25, 123.75]],
    ["SE", [123.75, 146.25]],
    ["SSE", [146.25, 168.75]],
    ["S", [168.75, 191.25]],
    ["SSO", [191.25, 213.75]],
    ["SO", [213.75, 236.25]],
    ["OSO", [236.25, 258.75]],
    ["O", [258.75, 281.25]],
    ["ONO", [281.25, 303.75]],
    ["NO", [303.75, 326.25]],
    ["NNO", [326.25, 348.75]]
]
const spots = JSON.parse(fs.readFileSync('data/data_spots.json'))

const add_spot = (req) => {
    const ids = []
    ids.spot = 1

    if (req.body.codepostal == undefined) {
        req.body.codepostal = null
    }
    if (req.body.structure == undefined) {
        req.body.structure = null
    }
    if (req.body.altitude == undefined) {
        req.body.altitude = null
    }
    if (req.body.lastupdate == undefined) {
        req.body.lastupdate = ""
    }
    const values_spots = [
        req.body.identity,
        req.body.name,
        req.body.codepostal,
        req.body.lat,
        req.body.lon,
        req.body.structure,
        req.body.altitude,
        req.body.lastupdate,
    ]

    db_mysql.query(insert_spot, [values_spots], (err, result) => {
        if (err) {
            console.log(err);
        }
        ids.spot = result.insertId
    })

    return ids.spot
}

const select_pratices = () => {
    const select_sport = 'SELECT * FROM `pratices` '
    const practices = []
    db_mysql.query(select_sport, (err, result) => {
        result.forEach((pratice) => {
            practices[pratice.name] = pratice.id
        })
        console.log(practices);

    })
    return practices
}

const insert_spot_orient = (req, spot, practices) => {
    if (req.body.pratiques == undefined) req.body.pratiques = []
    if (req.body.pratiques) {
        if (Array.isArray(req.body.pratiques)) {
            req.body.pratiques.forEach((practice) => {
                // var isNotIn = true

                // if (practices[practice._value]) {
                //     isNotIn = false
                //     return
                // }
                //
                //
                // if (isNotIn) {
                //     const truc = [
                //         practice._value
                //     ]
                //
                //     db_mysql.query(insert_practice, [truc], (err, result) => {
                //         if (err) {
                //             console.log(err);
                //             return
                //         }
                //         practices[practice._value] = result.insertId
                //     })
                // }

                console.log(spot);
                console.log(practices[practice]);
                const truc = [
                    spot,
                    practices[practice]
                ]

                db_mysql.query(spot_to_practice, [truc], (err, result) => {
                    if (err) {
                        console.log(err);
                        return
                    }
                })

            })
        } else {
            var isNotIn = true
            // practices.forEach((prac) => {
            if (practices[req.body.pratiques.value]) {
                const truc = [
                    spot,
                    practices[req.body.pratiques.value]
                ]

                db_mysql.query(spot_to_practice, [truc], (err, result) => {
                    if (err) {
                        console.log(err);
                        return
                    }
                })
            }
            // })

            // if (isNotIn) {
            //     const truc = [
            //         req.body.pratiques._value
            //     ]
            //
            //     db_mysql.query(insert_practice, [truc], (err, result) => {
            //         if (err) {
            //             console.log(err);
            //             return
            //         }
            //         practices[req.body.pratiques.pratique._value] = result.insertId
            //     })
            // }


        }
    }
}

const link_practice = (req, spot) => {

    insert_spot_orient(req, spot, select_pratices())

}


router.post('/', (req, res) => {
    const ids = []
    spot = 1

    link_practice(req, add_spot(req))

    // .then(() => {
    //     if (req.body.orientations == undefined) req.body.orientations = []
    //     if (req.body.orientations.orientation) {
    //         if (Array.isArray(req.body.orientations.orientation)) {
    //             req.body.orientations.orientation.forEach((orient) => {
    //                 const truc = [
    //                     spot,
    //                     orientation_tab[orient._value]
    //                 ]
    //
    //                 db_mysql.query(spot_to_orientation, [truc], (err, result) => {
    //                     if (err) {
    //                         console.log(err);
    //                         return
    //                     }
    //                     orientation_tab[orient._value] = result.id
    //                 })
    //             })
    //         } else if (req.body.orientations.orientation == "TOUTES") {
    //             orientation_tab.forEach((orient) => {
    //                 const truc = [
    //                     spot,
    //                     orient
    //                 ]
    //
    //                 db_mysql.query(spot_to_orientation, [truc], (err, result) => {
    //                     if (err) {
    //                         console.log(err);
    //                         return
    //                     }
    //                 })
    //             })
    //         } else {
    //             const truc = [
    //                 spot,
    //                 req.body.orientations.orientation._value
    //             ]
    //
    //             db_mysql.query(spot_to_orientation, [truc], (err, result) => {
    //                 if (err) {
    //                     console.log(err);
    //                     return
    //                 }
    //             })
    //         }
    //
    //     }
    // })
    // .then(() => {


    // if (isNotIn) {
    //     const truc = [
    //         req.body.pratiques._value
    //     ]
    //
    //     db_mysql.query(insert_practice, [truc], (err, result) => {
    //         if (err) {
    //             console.log(err);
    //             return
    //         }
    //         practices[req.body.pratiques.pratique._value] = result.insertId
    //     })
    // }




    // })
})









router.get('/populateDB', (req, res) => {
    const orientation_tab = []
    const practice_tab = []

    CardinalPoint.forEach((orient) => {
        const values = [
            orient[0],
            orient[1][0],
            orient[1][1],
        ]
        db_mysql.query(insert_orientation, [values], (err, result) => {
            if (err) {
                console.log(err);
                return
            }
            orientation_tab[orient[0]] = result.insertId
        })
    })


    spots.sites.site.forEach((spot) => {

        const ids = 1

        if (spot.codepostal == undefined) {
            spot.codepostal = []
            spot.codepostal._value = null
        }
        if (spot.structure == undefined) {
            spot.structure = []
            spot.structure._value = null
        }
        if (spot.altitude == undefined) {
            spot.altitude = []
            spot.altitude._value = null
        }
        // if (spot.codepostal._value == undefined) spot.codepostal._value = NULL
        const values_spots = [
            spot._identifiant,
            spot.nom,
            spot.codepostal._value,
            spot.coord._lat,
            spot.coord._lon,
            spot.structure._value,
            spot.altitude._value,
            spot.lastupdate._value,
        ]

        db_mysql.query(insert_spot, [values_spots], (err, result) => {
            if (err) {
                console.log(err);
                return
            }
            ids.spot = result.insertId
            // console.log(ids.spot);
        })


        //orientation
        // if (spot.orientations == undefined) spot.orientations =[]
        // if (spot.orientations.orientation) {
        //     if (Array.isArray(spot.orientations.orientation)) {
        //         spot.orientations.orientation.forEach((orient) => {
        //             const truc = [
        //                 ids.spot,
        //                 orientation_tab[orient._value]
        //             ]
        //
        //             db_mysql.query(spot_to_orientation, [truc], (err, result) => {
        //                 if (err) {
        //                     console.log(err);
        //                     return
        //                 }
        //                 orientation_tab[orient._value] = result.id
        //             })
        //         })
        //     } else if (spot.orientations.orientation == "TOUTES") {
        //         orientation_tab.forEach((orient) => {
        //             const truc = [
        //                 ids.spot,
        //                 orient
        //             ]
        //
        //             db_mysql.query(spot_to_orientation, [truc], (err, result) => {
        //                 if (err) {
        //                     console.log(err);
        //                     return
        //                 }
        //             })
        //         })
        //     } else {
        //         const truc = [
        //             ids.spot,
        //             spot.orientations.orientation._value
        //         ]
        //
        //         db_mysql.query(spot_to_orientation, [truc], (err, result) => {
        //             if (err) {
        //                 console.log(err);
        //                 return
        //             }
        //         })
        //     }
        //
        // }

        // pratique
        if (spot.pratiques == undefined) spot.pratiques = []
        if (spot.pratiques.pratique) {
            if (Array.isArray(spot.pratiques.pratique)) {
                spot.pratiques.pratique.forEach((practice) => {
                    var isNotIn = true
                    // practice_tab.forEach((prac) => {
                    if (practice_tab[practice._value]) {
                        isNotIn = false
                        return
                    }
                    // })

                    if (isNotIn) {
                        const truc = [
                            practice._value
                        ]

                        db_mysql.query(insert_practice, [truc], (err, result) => {
                            if (err) {
                                console.log(err);
                                return
                            }
                            practice_tab[practice._value] = result.insertId
                        })
                    }

                    // const truc = [
                    //     ids.spot,
                    //     practice_tab[practice._value]
                    // ]
                    //
                    // db_mysql.query(spot_to_practice, [truc], (err, result) => {
                    //     if (err) {
                    //         console.log(err);
                    //         return
                    //     }
                    // })

                })
            } else {
                var isNotIn = true
                // practice_tab.forEach((prac) => {
                if (practice_tab[spot.pratiques.pratique._value]) {
                    isNotIn = false
                    return
                }
                // })

                if (isNotIn) {
                    const truc = [
                        spot.pratiques.pratique._value
                    ]

                    db_mysql.query(insert_practice, [truc], (err, result) => {
                        if (err) {
                            console.log(err);
                            return
                        }
                        practice_tab[spot.pratiques.pratique._value] = result.insertId
                    })
                }

                // const truc = [
                //     ids.spot,
                //     practice_tab[spot.pratiques.pratique._value]
                // ]
                //
                // db_mysql.query(spot_to_practice, [truc], (err, result) => {
                //     if (err) {
                //         console.log(err);
                //         return
                //     }
                // })
            }
        }
        console.log(practice_tab);
    })

    // console.log(practice_tab);
})

module.exports = router;
