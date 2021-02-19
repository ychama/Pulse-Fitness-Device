import React, { useEffect, useState } from "react";
import { makeStyles, useTheme, createStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {
  Button,
  Menu,
  Dropdown,
  Select,
  Input,
  Checkbox,
  Table,
  Modal,
} from "antd";
import { DownOutlined } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import API, { graphqlOperation } from "@aws-amplify/api";
import PDFViewer from "pdf-viewer-reactjs";
import * as mutations from "../../../graphql/mutations";
import { getMeetingNotes, getStudyCaseForms } from "../../../app/graphql";
import SimpleFormButton from "../../../app/views/material-kit/forms/SimpleFormButton";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: "100%",
      backgroundColor: theme.palette.background.paper,
      height: "85vh",
      overflowY: "scroll",
    },
    rootForm: {
      display: "flex",
    },
    rootForm2: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
    titleParent: {
      color: "#000",
      margin: "20px 5px",
      fontWeight: "bold",
      display: "inline-block",
    },

    textBox: {
      width: "100%",
    },
  })
);
export default function VisitBaseTabs(props) {
  const { Option } = Select;
  const { Search } = Input;
  const { meetingId, visitType, studyCase, changed } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [isModalVideo, setIsModalVideo] = useState(false);
  const [usrlVideo, setUrlVideo] = useState(null);
  const [value, setValue] = React.useState(0);
  /* const [stage, setStage] = React.useState(new Map(props.stages)); */
  const inputCaption = props.caption;
  const inputContent = props.content;
  const [open, setOpen] = React.useState(false);
  const [openForm, setOpenForm] = React.useState(false);
  const [content, setContent] = React.useState("");
  const [caption, setCaption] = React.useState("");
  const [needChange, setNeedChange] = useState([]);
  const [notes, setNotes] = useState([]);
  const [urlPdf, setUrlPdf] = useState(null);
  const date = new Date();
  const pdfHistoryDB = {
    items: [
      {
        id: "123jdfher3wh23",
        date: new Date(date.getFullYear(), date.getMonth(), 1),
        address: "https://s21.q4cdn.com/798735247/files/doc_downloads/test.pdf",
        name: "PDF One",
      },
      {
        id: "684jdfher3wh23",
        date: new Date(date.getFullYear(), date.getMonth(), 7),
        address: "http://www.orimi.com/pdf-test.pdf",
        name: "PDF Two",
      },
    ],
  };
  const videoHistoryDB = {
    items: [
      {
        id: "123jdfher3wh23",
        date: new Date(date.getFullYear(), date.getMonth(), 1),
        visitType: "VISIT_1",
        address:
          "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
      },
      {
        id: "684jdfher3wh23",
        visitType: "VISIT_2",
        date: new Date(date.getFullYear(), date.getMonth(), 7),

        address:
          "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
      },
    ],
  };
  const columnsVideoHistory = [
    {
      title: "Name",
      dataIndex: "visitType",
      key: "visitType",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text, row) => <>{JSON.stringify(row.date).split("T")[0]}</>,
    },
    {
      title: "Link",
      dataIndex: "address",
      key: "address",
      render: (text, row) => (
        <a onClick={(e) => showVideo(e, row.address)}>play</a>
      ),
    },
  ];
  useEffect(() => {
    fetchData();
  }, [needChange]);
  const onSearch = (value) => console.log(value);
  const showVideo = (e, url) => {
    e.preventDefault();
    setUrlVideo(url);
    setIsModalVideo(true);
  };
  const fetchData = async () => {
    await API.graphql(graphqlOperation(getMeetingNotes, { meetingId })).then(
      (n) => {
        setNotes(
          n.data.listNotes.items.reduce((r, a) => {
            r[a.visitType] = r[a.visitType] || [];
            r[a.visitType].push(a);
            return r;
          }, Object.create(null))
        );
      }
    );

    await API.graphql(
      graphqlOperation(getStudyCaseForms, { StudyCaseId: studyCase })
    ).then((n) => {
      setNotes(
        n.data.listForms.items.reduce((r, a) => {
          r[a.formType] = r[a.formType] || [];
          r[a.formType].push(a);
          return r;
        }, Object.create(null))
      );
    });
  };
  const onChangeParentResource = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };
  const handleClickView = () => {
    console.log(inputContent);
    setContent(inputContent);
    setCaption(inputCaption);
    setOpen(true);
  };
  const handleAdd = () => {
    const createdNote = API.graphql({
      query: mutations.createNote,
      variables: {
        input: {
          caption,
          content,
          meetingId,
          visitType,
          studyCase,
        },
      },
    });
    createdNote.then(() => {
      console.log("Note is created");
      changed();
      setOpen(false);
    });
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClose = () => {
    setOpen(false);
    setOpenForm(false);
  };

  const handleAddForm = () => {
    const createdNote = API.graphql({
      query: mutations.createNote,
      variables: {
        input: {
          content,
          meetingId,
          visitType,
          studyCase,
        },
      },
    });
    createdNote.then(() => {
      console.log("Note is created");
      changed();
      setOpen(false);
    });
  };
  const onChangePDF = (value) => {
    console.log(`selected ${value}`);
    setUrlPdf(value);
  };
  return (
    <div className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        centered
        aria-label="scrollable prevent"
      >
        <Tab label="Charting" {...a11yProps(0)} />
        <Tab label="Teaching" {...a11yProps(1)} />
        <Tab label="Parent Resources" {...a11yProps(2)} />
        <Tab label="Video Log" {...a11yProps(3)} />
      </Tabs>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1" onClick={() => setOpenForm(true)}>
                Contact log
              </Menu.Item>
              <Menu.Item key="2">Home integrity tool (INTERVENTION)</Menu.Item>
              <Menu.Item key="3">Home integrity tool (CONTROL)</Menu.Item>
              <Menu.Item key="4">Buccal Tracking</Menu.Item>
              <Menu.Item key="5">Mother's Feedback Record</Menu.Item>
              <Menu.Item key="6" onClick={() => handleClickView()}>
                Nursing Notes
              </Menu.Item>
            </Menu>
          }
        >
          <Button>
            Add note <DownOutlined />
          </Button>
        </Dropdown>
        {/* <VisitDividers
                    meetingId={meetingId}
                    visitType={visitType}
                    studycase={studyCase}
                /> */}
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Search"
          optionFilterProp="children"
          onChange={onChangePDF}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {pdfHistoryDB.items.map((item) => (
            <Option key={item.id} value={item.address}>
              {item.name}
            </Option>
          ))}
        </Select>
        {urlPdf !== null && (
          <div
            style={{
              border: "2px solid rgba(0, 0, 0, 0.3)",
              height: "100%",
              width: "100%",
              margin: "20px auto",
              padding: "10px",
            }}
          >
            <PDFViewer
              document={{
                url: urlPdf,
              }}
            />
          </div>
        )}
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <Search
          placeholder="search"
          allowClear
          onSearch={onSearch}
          style={{ width: 200, margin: "0 10px" }}
        />
        <div
          style={{
            border: "2px solid rgba(0, 0, 0, 0.3)",
            height: "100%",
            width: "100%",
            margin: "20px auto",
            padding: "10px",
          }}
        >
          <span className={classes.titleParent}>Title</span>
          <span className={classes.titleParent}>Tag</span>
          <span className={classes.titleParent}>Link</span>
          <br />
          <Checkbox onChange={onChangeParentResource}>Checkbox1</Checkbox>
          <br />
          <br />
          <Checkbox onChange={onChangeParentResource}>Checkbox2</Checkbox>
          <br />
          <br />
          <Checkbox onChange={onChangeParentResource}>Checkbox3</Checkbox>
          <br />
          <br />
          <Checkbox onChange={onChangeParentResource}>Checkbox4</Checkbox>
        </div>
      </TabPanel>
      <TabPanel value={value} index={3} dir={theme.direction}>
        <Table
          dataSource={videoHistoryDB.items}
          columns={columnsVideoHistory}
        />
      </TabPanel>

      <div className={classes.rootForm}>
        <Dialog
          open={open}
          classes={{ container: classes.container }}
          onClose={handleClose}
          fullScreen
          fullWidth
          style={{ position: "absolute" }}
          maxWidth="md-6"
          aria-labelledby="form-dialog-title"
          container={() => document.getElementById("forms-parent-answer")}
        >
          <DialogTitle id="form-dialog-title">Add note</DialogTitle>
          <DialogContent>
            <TextField
              label="Caption"
              placeholder="caption"
              variant="outlined"
              onChange={(e) => {
                setCaption(e.target.value);
              }}
              value={caption}
            />
            <br />
            <br />

            <TextField
              label="Content"
              multiline
              rows={10}
              variant="outlined"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
            {/* <TextareaAutosize
                    autoFocus
                    margin="dense"
                    id="content"
                    label="Content"
                    rowsMin={8}

                    value={content}
                /> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              close
            </Button>

            <Button onClick={handleAdd} color="primary">
              Add{" "}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openForm}
          classes={{ container: classes.container }}
          onClose={handleClose}
          fullScreen
          fullWidth
          style={{ position: "absolute" }}
          maxWidth="md-6"
          aria-labelledby="form-dialog-title"
          container={() => document.getElementById("forms-parent-answer")}
        >
          <DialogTitle id="form-dialog-title">Add Form</DialogTitle>
          <DialogContent>
            <SimpleFormButton />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              close
            </Button>

            <Button onClick={handleAddForm} color="primary">
              Add{" "}
            </Button>
          </DialogActions>
        </Dialog>

        <IconButton aria-label="note">
          <br />
          <InputLabel htmlFor="noteIcon">{inputCaption}</InputLabel>
        </IconButton>
      </div>
      {isModalVideo && (
        <Modal
          title="Show Video"
          visible={isModalVideo}
          onCancel={() => {
            setUrlVideo(null);
            setIsModalVideo(false);
          }}
        >
          {usrlVideo !== null && (
            <video
              width="100%"
              height="300"
              autoPlay
              controls
              style={{
                margin: "10px auto",
                border: "1px solid #e0e0e0",
                borderRadius: "5px",
              }}
            >
              <source src={usrlVideo} />
              Your browser does not support the video tag.
            </video>
          )}
        </Modal>
      )}
    </div>
  );
}
