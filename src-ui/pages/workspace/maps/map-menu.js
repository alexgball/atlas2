/*jshint esversion: 6 */

import React, {PropTypes} from 'react';
import {Nav, NavItem, Navbar, Glyphicon} from 'react-bootstrap';
import WorkspaceStore from './../workspace-store';
import {LinkContainer} from 'react-router-bootstrap';
import Actions from '../../../actions';
import $ from 'jquery';
var Blob = require('blob');

export default class MapMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = WorkspaceStore.getMapInfo(this.props.params.mapID);
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this._onChange = this._onChange.bind(this);
    this.openEditMapDialog = this.openEditMapDialog.bind(this);
  }

  openEditMapDialog(mapid) {
    Actions.openEditMapDialog(mapid);
  }

  download(maplink, tempName) {
    $.ajax({
      url: maplink,
      type: 'GET',
      xhrFields: {
        responseType: 'blob'
      },
      success: function(data, textStatus, jqxhr) {
        var file = new Blob([data], {"type": jqxhr.getResponseHeader("Content-Type")});
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(file);
        link.download = tempName;
        link.click();
      }
    });
  }

  render() {
    var mapID = this.props.params.mapID;

    var deduplicateHref = '/deduplicate/' + this.state.map.workspace;
    var tempName = mapID + '.png';
    var downloadMapHref = '/img/' + tempName;
    return (
      <Nav>
        <NavItem eventKey={1} href="#" key="1" onClick={this.openEditMapDialog.bind(this, mapID)}>
          <Glyphicon glyph="edit"></Glyphicon>&nbsp; Edit map info
        </NavItem>
        <NavItem eventKey={2} key="2" href="#" download={tempName} onClick={this.download.bind(this, downloadMapHref, tempName)}>
          <Glyphicon glyph="download"></Glyphicon>&nbsp; Download
        </NavItem>
        <LinkContainer to={{
          pathname: deduplicateHref
        }}>
          <NavItem eventKey={3} href={deduplicateHref} key="2">
          <Glyphicon glyph="pawn"></Glyphicon>
          <Glyphicon glyph="pawn" style={{
            color: "silver"
          }}></Glyphicon>&nbsp;
            Deduplicate
          </NavItem>
        </LinkContainer>
      </Nav>
    );
  }
  componentDidMount() {
    WorkspaceStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    WorkspaceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
      this.setState(WorkspaceStore.getMapInfo(this.props.params.mapID));
  }
}
