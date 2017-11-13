function getSortedtask(result) {

    console.log('sorting according to links', result)

    var date = new Date()

    return Promise.all(result.map(function (doc, key) {

        return db.get(doc._id)

            .then(function (resultData) {

                if (resultData.link_task.length > 0) {

                    return Promise.all(resultData.link_task.map(function (linkRes, i) {

                        var index = result.map(function (data, j) { return data._id; }).indexOf(linkRes.task_id)

                        var duration = resultData.time_take

                        let linkStatus = linkRes.link_status

                        var totalLag = Number(linkRes.lag)

                        let resultSD = new Date(result[index]['start_date'])

                        let resultED = new Date(result[index]['end_date'])

                        let linkedTaskSD = new Date(resultSD.getFullYear(), resultSD.getMonth(), resultSD.getDate())

                        let linkedTaskED = new Date(resultED.getFullYear(), resultED.getMonth(), resultED.getDate())

                        console.log('duration', duration)

                        if (linkRes.link_status == 'fs') {

                            let resultDates = getLinkedDate(totalLag, linkStatus, linkedTaskSD, linkedTaskED, duration)

                            console.log('resultDates', resultDates)

                            resultData.start_date = resultDates.taskSD

                            resultData.end_date = resultDates.taskED

                        } else if (linkRes.link_status == 'fst') {

                            let resultDates = getLinkedDate(totalLag, linkStatus, linkedTaskSD, linkedTaskED, duration)

                            console.log('resultDates', resultDates)

                            resultData.start_date = resultDates.taskSD

                            resultData.end_date = resultDates.taskED

                        } else if (linkRes.link_status == 'ss') {


                            let resultDates = getLinkedDate(totalLag, linkStatus, linkedTaskSD, linkedTaskED, duration)

                            console.log('resultDates', resultDates)

                            resultData.start_date = resultDates.taskSD

                            resultData.end_date = resultDates.taskED

                        } else {

                            let resultDates = getLinkedDate(totalLag, linkStatus, linkedTaskSD, linkedTaskED, duration)

                            console.log('resultDates', resultDates)

                            resultData.start_date = resultDates.taskSD

                            resultData.end_date = resultDates.taskED

                        }

                        console.log("linked task", resultData)

                    })).then(function () {

                        return db.put(resultData)

                    })

                }



            })



    })).then(function (result) {

        return result

    })

}





function getLinkedDate(totalLag, linkStatus, linkedTaskSD, linkedTaskED, durationOfTask) {

    if (linkStatus == 'fs') {

        let calcDate = new Date(linkedTaskED)

        calcDate = new Date(calcDate.setDate(calcDate.getDate() + 1));

        while (calcDate.getDay() == 0 || calcDate.getDay() == 6) {

            calcDate = new Date(calcDate.setDate(calcDate.getDate() + 1));

        }

        let getLinkedSD = getLinkedDates(totalLag, calcDate)

        let getLinkedED = getDurationDate(durationOfTask, getLinkedSD, 'forward')

        console.log('getLinkedSD', getLinkedSD, 'getLinkedED', getLinkedED)

        return { taskSD: getLinkedSD, taskEnd: getLinkedED }

    } else if (linkStatus == 'fst') {

        let getLinkedED = getLinkedDates(totalLag, linkedTaskED)

        let getLinkedSD = getDurationDate(durationOfTask, getLinkedED, 'backward')

        return { taskSD: getLinkedSD, taskEnd: getLinkedED }

    } else if (linkStatus == 'ss') {
        let getLinkedSD = getLinkedDates(totalLag, linkedTaskSD)
        let getLinkedED = getDurationDate(durationOfTask, getLinkedSD, 'forward')

        return { taskSD: getLinkedSD, taskEnd: getLinkedED }

    } else {
        let getLinkedED = getLinkedDates(totalLag, linkedTaskSD)
        let getLinkedED = getDurationDate(durationOfTask, getLinkedSD, 'forward')

        return { taskSD: getLinkedSD, taskEnd: getLinkedED }
    }

}





function getLinkedDates(totalLag, linkedTaskDate) {

    let lag = Math.abs(totalLag), finalDate;

    if (totalLag == 0) {

        return linkedTaskDate

    } else {

        if (totalLag < 0) {

            finalDate = getNegativeDate(lag, linkedTaskDate)

        } else {

            finalDate = getPositiveDate(lag, linkedTaskDate)

        }

        return finalDate

    }

}



function getNegativeDate(lag, linkedTaskED) {

    let count = 0, noOfDaysToAdd = lag, calcDate = new Date(linkedTaskED)

    while (count < noOfDaysToAdd) {

        calcDate = new Date(calcDate.setDate(calcDate.getDate() - 1));

        if (calcDate.getDay() != 0 && calcDate.getDay() != 6) {

            count++;

        }

    }

    return calcDate;

}



function getPositiveDate(lag, linkedTaskED) {

    let count = 0, noOfDaysToAdd = lag, calcDate = new Date(linkedTaskED)

    while (count < noOfDaysToAdd) {

        calcDate = new Date(calcDate.setDate(calcDate.getDate() + 1));

        if (calcDate.getDay() != 0 && calcDate.getDay() != 6) {

            count++;

        }

    }

    return calcDate;

}



function getDurationDate(durationOfTask, dateVal, type) {

    let count = 0, noOfDaysToAdd = durationOfTask, calcDate = new Date(dateVal)

    if (type == 'forward') {
        if (noOfDaysToAdd > 1) {

            while (count < noOfDaysToAdd - 1) {

                if (calcDate.getDay() != 0 && calcDate.getDay() != 6) {

                    count++;

                }

                calcDate = new Date(calcDate.setDate(calcDate.getDate() + 1));

            }

            return calcDate

        } else {

            return calcDate

        }

    } else {
        if (noOfDaysToAdd > 1) {

            while (count < noOfDaysToAdd - 1) {

                if (calcDate.getDay() != 0 && calcDate.getDay() != 6) {

                    count++;

                }

                calcDate = new Date(calcDate.setDate(calcDate.getDate() - 1));

            }

            return calcDate

        } else {

            return calcDate

        }
    }

}
