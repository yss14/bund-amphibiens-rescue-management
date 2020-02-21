import * as Express from "express";
import { SheetService } from "../../services/sheet-service/SheetService";
import * as moment from "moment";
import { minBy, maxBy, max, min } from "lodash"
const ChartjsNode = require("chartjs-node");
const Chartjs = require("chart.js");

export const makeGetStatisticRoute = (sheetService: SheetService): Express.RequestHandler => async (req, res) => {
	const year = parseInt(req.query.year) || moment().year()

	const sheets = await sheetService.getAllSheets();
	const sheetsOfYear = sheets.filter(sheet => moment(sheet.dateOfRecord).year() === year)
	const dates = sheetsOfYear.map(sheet => moment(sheet.dateOfRecord))

	const startDate = minBy(dates, date => date.valueOf())!
	let endDate = maxBy(dates, date => date.valueOf())!

	if (endDate.isBefore(moment('04-10-' + year))) {
		endDate = moment('04-10-' + year)
	}

	console.log({ year, startDate, endDate, diff: startDate.diff(endDate, 'days') })

	const dateAmphibiansMap = new Map<string, number>()
	const dateTemperatureMap = new Map<string, number>()

	for (const sheet of sheetsOfYear) {
		const sheetDateFormated = moment(sheet.dateOfRecord).format("DD-MM-YYYY")
		const numberOfAmphibians = sheet.tableItems.reduce((acc, item) => acc + item.amount, 0)
		const temeperatur = sheet.temperature

		if (!dateAmphibiansMap.has(sheetDateFormated)) {
			dateAmphibiansMap.set(sheetDateFormated, numberOfAmphibians)
			dateTemperatureMap.set(sheetDateFormated, temeperatur)
		} else {
			dateAmphibiansMap.set(sheetDateFormated, dateAmphibiansMap.get(sheetDateFormated)! + numberOfAmphibians)
			dateTemperatureMap.set(sheetDateFormated, (dateTemperatureMap.get(sheetDateFormated)! + temeperatur) / 2.0)
		}
	}

	const daysDiff = Math.abs(startDate.diff(endDate, 'days'))

	const amphibiansDaywiseData: (number | null)[] = [null]
	const temperaturDaywiseData: (number | null)[] = [null]
	const labelsDaywise = [moment(startDate).subtract(1, 'days').format("DD .MMM")]

	for (let i = 0; i < daysDiff; ++i) {
		const dateFormated = moment(startDate).add(i, 'days').format("DD-MM-YYYY")

		labelsDaywise.push(moment(startDate).add(i, 'days').format("DD .MMM"))

		if (!dateAmphibiansMap.has(dateFormated)) {
			amphibiansDaywiseData.push(null)
			temperaturDaywiseData.push(null)
		} else {
			amphibiansDaywiseData.push(dateAmphibiansMap.get(dateFormated)!)
			temperaturDaywiseData.push(dateTemperatureMap.get(dateFormated)!)
		}
	}

	// console.log(amphibiansDaywiseData, temperaturDaywiseData, labelsDaywise)

	const data = {
		datasets: [
			{
				label: "Tiere / Tag",
				yAxisID: "tiere",
				data: amphibiansDaywiseData,
				type: "bar",
				backgroundColor: "#984805"
			},
			{
				label: "Temperatur / °C",
				yAxisID: "temperature",
				data: temperaturDaywiseData,
				type: "line",
				backgroundColor: "#dbe5f1"
			}
		],
		labels: labelsDaywise,
	}

	const options = {
		title: {
			display: true,
			text: "Killenweiher: Frühjahrswanderung der Amphibien in " + year,
			fontSize: 18
		},
		legend: {
			display: false
		},
		scales: {
			yAxes: [
				{
					id: "tiere",
					position: "left",
					ticks: {
						max: max(amphibiansDaywiseData)! + 1,
						min: min(amphibiansDaywiseData)! - 1,
					},
					scaleLabel: {
						display: true,
						labelString: "Temperatur / °C",
						fontSize: 14,
						color: "#000000"
					},
					gridLines: {
						drawBorder: false
					}
				},
				{
					id: "temperature",
					position: "right",
					ticks: {
						max: max(temperaturDaywiseData)! + 1,
						min: min(temperaturDaywiseData)! - 1,
					},
					scaleLabel: {
						display: true,
						labelString: "Tiere / Tag",
						fontSize: 14,
						color: "#000000"
					},
					gridLines: {
						display: false,
						drawBorder: false
					}
				}
			],
			xAxes: [
				{
					barPercentage: 0.4,
					ticks: {
						autoSkip: true,
						maxTicksLimit: 10
					}
				}
			]
		},
		layout: {
			padding: {
				left: 20,
				right: 20,
				top: 20,
				bottom: 20
			}
		}
	}

	const chartNode = new ChartjsNode(1200, 600);

	Chartjs.plugins.register({
		beforeDraw: function (chartInstance: any) {
			var ctx = chartInstance.chart.ctx;
			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
		}
	})

	const imageBuffer = await chartNode
		.drawChart({
			data,
			options
		})
		.then(() => chartNode.getImageBuffer("image/png"))


	res.setHeader('Content-Type', 'image/png')
	res.send(imageBuffer)
}
