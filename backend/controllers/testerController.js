const Test = require("../models/testModel");
const Rapport = require("../models/rapportModel");
const Bytecode = require("../models/bytecodeModel");
const util = require("util");
const { exec, spawn } = require("child_process");
const jwt = require("jsonwebtoken");
const execPromise = util.promisify(require("child_process").exec);
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const { getTemplate } = require("../test/template/getTemplate");
const { postTemplate } = require("../test/template/postTemplate");
const bytes = require("bytes");
const pidusage = require("pidusage");
const moment = require("moment");

function calculateMajority(arr) {
  let trueCount = 0;
  let falseCount = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "true") {
      trueCount++;
    } else {
      falseCount++;
    }
  }

  if (trueCount > falseCount) {
    return true;
  } else {
    return false;
  }
}

function calculatePercentage(arr) {
  let trueCount = 0;
  let falseCount = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "true") {
      trueCount++;
    } else {
      falseCount++;
    }
  }

  const truePercentage = (trueCount / arr.length) * 100;
  const falsePercentage = (falseCount / arr.length) * 100;

  return { truePercentage, falsePercentage };
}

const executeTest = async (req, res) => {
  const statsArray = [];
  //initialzing a void status
  const status = "";
  let data = "";
  if (req.body.method === "post") {
    data = req.body.data || "";
    data = JSON.stringify(data, null, 2)
      .replace(/\\n/g, "&#xd;")
      .replace(/"/g, "&quot;");
  }

  //creating a new test
  const test = new Test({
    protocol: req.body.protocol,
    url: req.body.url,
    port: req.body.port,
    path: req.body.path,
    method: req.body.method,
    createdBy: req.body.createdBy,
    usersNumber: req.body.usersNumber,
    status,
    data,
    testName: req.body.testName,
  });

  const savedTest = await test.save();
  const testId = savedTest._id;
  const testFileName = `test_${testId}.jmx`;

  if (!req.file) {
    const item_bytecode = Bytecode.find({ test: testId });
    console.log(item_bytecode);
  } else {
    const fileContents = fs.readFileSync(req.file.path);
    const hexString = fileContents.toString("hex");

    const bytecode = new Bytecode({
      timeStamp: new Date(),
      bytes: Buffer.from(hexString, "hex"),
      test: testId,
    });
    await bytecode.save();
  }

  //the path to the jmx file
  const jmxOutputPath = path.join(
    __dirname,
    "../",
    "/test/tests",
    testFileName
  );
  // the jmx template
  if (test.method === "get") {
    fs.writeFileSync(jmxOutputPath, getTemplate(test), "utf-8");
  } else if (test.method === "post") {
    fs.writeFileSync(jmxOutputPath, postTemplate(test), "utf-8");
  }

  const reportFileName = `reports_${testId}.csv`;
  const reportPath = path.join(
    __dirname,
    "../",
    "/test/reports",
    reportFileName
  );

  //jmeter command the path should be updated
  //const jmeterCommand = `${process.env.JMETERPATH} -n -t ${jmxOutputPath} -l ${reportPath}`;

  // Exécute la commande "ls" avec les arguments "-la"
  const ls = spawn(`${process.env.JMETERPATH}`, [
    `-n`,
    `-t`,
    `${jmxOutputPath}`,
    `-l`,
    `${reportPath}`,
  ]);

  // Affiche les données envoyées dans la sortie standard
  ls.stdout.on("data", async (data) => {
    console.log(`JMeter test started: ${data}`);
    try {
      // Execute the jps command to list all Java processes
      const { stdout: jpsStdout, stderr: jpsStderr } = await execPromise("jps");

      if (jpsStderr) {
        console.error(`exec error: ${jpsStderr}`);
        return res.status(500).send("Error getting JVM metrics");
      }
      // Parse the output of the jps command to find the process ID of the JVM
      const lines = jpsStdout.split("\n");
      let processId = null;
      lines.forEach((line) => {
        if (line.includes("TestApplication")) {
          const parts = line.split(" ");
          processId = parts[0];
        }
      });
      if (!processId) {
        console.error("Could not find JVM process");
        for (i = 0; i < 11; i++) {
          const now = new Date();

          const day = String(now.getDate()).padStart(2, "0");
          const month = String(now.getMonth() + 1).padStart(2, "0"); // +1 car les mois commencent à 0
          const year = now.getFullYear();

          const hour = String(now.getHours()).padStart(2, "0");
          const minute = String(now.getMinutes()).padStart(2, "0");
          const second = String(now.getSeconds()).padStart(2, "0");

          const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${
            parseInt(second) + i
          }`;

          const updateStatsArray = async () => {
            await Test.updateOne(
              { _id: testId },
              {
                $push: {
                  detail: {
                    cpu: "0%",
                    memory: "0 MB",
                    timestamp: formattedDate,
                  },
                },
              }
            );
          };
          // schedule the update function to run every second
          const intervalId = setInterval(updateStatsArray, 1500);
          setTimeout(() => {
            clearInterval(intervalId);
          }, 15000);
        }
      } else {
        // define a function to update the stats array
        const updateStatsArray = async () => {
          const stats = await pidusage(processId);
          await Test.updateOne(
            { _id: testId },
            {
              $push: {
                detail: {
                  cpu: stats.cpu.toFixed(2) + "%",
                  memory: bytes(stats.memory),
                  timestamp: moment(stats.timestamp).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ),
                },
              },
            }
          );
        };

        // schedule the update function to run every second
        const intervalId = setInterval(updateStatsArray, 1200);
        setTimeout(() => {
          clearInterval(intervalId);
        }, 15000);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Internal server error" });
    }
  });

  // Affiche les données envoyées dans la sortie d'erreur
  ls.stderr.on("data", (data) => {
    console.error(`JMeter test failed: ${data}`);
    res.status(500).send({ message: "JMeter test failed" });
  });

  // Affiche un message quand le processus est terminé
  ls.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    setTimeout(() => {
      const results = [];
      fs.createReadStream(reportPath)
        .pipe(csv())
        .on("data", (row) => {
          results.push(row["success"]);
          // const rapport = new Rapport({
          //   timeStamp: new Date(parseInt(row.timeStamp)),
          //   elapsed: !isNaN(row.elapsed) ? parseInt(row.elapsed) : 0,
          //   bytes: !isNaN(row.bytes) ? parseInt(row.bytes) : 0,
          //   sentBytes: !isNaN(row.sentBytes) ? parseInt(row.sentBytes) : 0,
          //   Latency: !isNaN(row.Latency) ? parseInt(row.Latency) : 0,
          //   Connect: !isNaN(row.Connect) ? parseInt(row.Connect) : 0,
          //   processTime:
          //     !isNaN(row.elapsed) && !isNaN(row.Connect) && !isNaN(row.Latency)
          //       ? parseInt(row.elapsed) * 2 -
          //         parseInt(row.Connect) -
          //         parseInt(row.Latency)
          //       : 0,
          //   responseCode: !isNaN(row.responseCode)
          //     ? parseInt(row.responseCode)
          //     : 400,
          //   success: row.success === 1,
          // });
          // rapport.save().catch((error) => console.error(error));
        })
        .on("end", async () => {
          let majority = calculateMajority(results);
          test.pourcentage.passed = calculatePercentage(results).truePercentage;
          test.pourcentage.failed =
            calculatePercentage(results).falsePercentage;
          majority === true
            ? (test.status = "Passed")
            : (test.status = "failed");
          await test
            .save()
            .then((data) => res.send(data))
            .catch((err) => {
              res.status(500).send({
                message: err.message || "Error",
              });
            });
        });
    }, 10000);
  });
};

const getAllTests = (req, res) => {
  Test.find();
  var total = Test.count();
  Test.find()
    .populate("createdBy")
    .exec()
    .then((data) => {
      res.set("Access-Control-Expose-Headers", "X-Total-Count");
      res.set("X-Total-Count", total);
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error",
      });
    });
};

const TestStatePerUser = (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const currentUser = jwt.verify(token, process.env.TOKEN_KEY);
  Test.find({ createdBy: currentUser.userId }).then((total) => {
    Test.find({ createdBy: currentUser.userId, status: "Passed" })
      .then((passed) => {
        res.set("Access-Control-Expose-Headers", "X-Total-Count");
        Test.find({
          createdBy: currentUser.userId,
          status: "failed",
        }).then((failed) => {
          res.status(200).json({
            runPerUser: total.length,
            passedTests: passed.length,
            failedTests: failed.length,
          });
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error",
        });
      });
  });
};

const TestsPerUser = (req, res) => {
  Test.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        count: 1,
      },
    },
    {
      $sort: {
        date: 1,
      },
    },
  ])
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
};

const getTestById = async (req, res) => {
  const id = req.params.id;
  await Test.findById(id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((e) => {
      res.status(500).json(e);
    });
};

//exports
exports.executeTest = executeTest;
exports.getAllTests = getAllTests;
exports.TestStatePerUser = TestStatePerUser;
exports.TestsPerUser = TestsPerUser;
exports.getTestById = getTestById;
