
let APP_DATA = null;

async function loadData(){
  const res = await fetch('assets/data/app-data.json');
  APP_DATA = await res.json();
  renderShell();
  renderPage('dashboard');
}

function moneyStatusBadge(v){
  const s = String(v).toLowerCase();
  if(['present','active','online'].includes(s)) return 'success';
  if(['late','monitoring'].includes(s)) return 'warning';
  if(['absent','offline'].includes(s)) return 'danger';
  return 'info';
}

function rowStatus(value){
  return `<span class="badge ${moneyStatusBadge(value)}">${value}</span>`;
}

function setActive(name){
  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === name);
  });
}

function renderShell(){
  document.getElementById('appName').textContent = APP_DATA.appName;
  document.getElementById('companyName').textContent = APP_DATA.company;
  document.getElementById('userName').textContent = APP_DATA.user.name;
  document.getElementById('userRole').textContent = APP_DATA.user.role;
}

function renderStats(){
  return APP_DATA.stats.map(s => `
    <div class="card kpi">
      <div class="value">${s.value}</div>
      <div class="label">${s.label}</div>
    </div>
  `).join('');
}

function renderDashboard(){
  const attendanceRows = APP_DATA.attendance.map(a => `
    <tr>
      <td>${a.lecturer}</td>
      <td>${a.room}</td>
      <td>${a.checkIn}</td>
      <td>${a.checkOut}</td>
      <td>${a.duration}</td>
      <td>${rowStatus(a.status)}</td>
    </tr>
  `).join('');

  const alerts = APP_DATA.alerts.map(a => `
    <div class="list-item">
      <div class="label-row">
        <strong>${a.type}</strong>
        <span class="muted">${a.time}</span>
      </div>
      <div class="muted" style="margin-top:8px">${a.message}</div>
    </div>
  `).join('');

  return `
    <div class="topbar">
      <div class="page-title">
        <h1>Dashboard</h1>
        <p>Presentation simulation of the expected live attendance monitoring environment.</p>
      </div>
      <div class="actions">
        <button class="btn btn-soft">Export Summary</button>
        <button class="btn btn-primary">Generate Daily Report</button>
      </div>
    </div>

    <div class="layout">
      <div class="kpis">${renderStats()}</div>

      <div class="grid-2">
        <div class="card">
          <h3 class="section-title">Live Attendance Overview</h3>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Lecturer</th>
                  <th>Room</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>${attendanceRows}</tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title">Today's Alerts</h3>
          <div class="list">${alerts}</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <h3 class="section-title">Weekly Attendance Trend</h3>
          <div class="chart">
            <div class="bars">
              <div class="bar" style="height:68%"><strong>82%</strong><span>Mon</span></div>
              <div class="bar" style="height:74%"><strong>89%</strong><span>Tue</span></div>
              <div class="bar" style="height:62%"><strong>77%</strong><span>Wed</span></div>
              <div class="bar" style="height:81%"><strong>93%</strong><span>Thu</span></div>
              <div class="bar" style="height:70%"><strong>85%</strong><span>Fri</span></div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title">System Summary</h3>
          <div class="list">
            <div class="list-item"><strong>Reminder Engine</strong><div class="muted">Email and SMS reminders are configured to reach lecturers one hour before the lecture starts.</div></div>
            <div class="list-item"><strong>AI Monitoring</strong><div class="muted">Advanced camera layer confirms room presence and estimates time spent inside the lecture room.</div></div>
            <div class="list-item"><strong>Identity Verification</strong><div class="muted">Biometric and RFID devices register lecturer entry and exit events per lecture room.</div></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderLecturers(){
  return `
    <div class="topbar">
      <div class="page-title"><h1>Lecturers</h1><p>Master register of lecturers enrolled in the attendance monitoring system.</p></div>
      <div class="actions"><button class="btn btn-primary">Add Lecturer</button></div>
    </div>
    <div class="card">
      <h3 class="section-title">Lecturer Registry</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Phone</th><th>Status</th></tr></thead>
          <tbody>
            ${APP_DATA.lecturers.map(x => `<tr><td>${x.id}</td><td>${x.name}</td><td>${x.dept}</td><td>${x.phone}</td><td>${rowStatus(x.status)}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderRooms(){
  return `
    <div class="topbar">
      <div class="page-title"><h1>Lecture Rooms</h1><p>Manage room devices, AI cameras, biometric terminals, and RFID readers.</p></div>
      <div class="actions"><button class="btn btn-primary">Register Room</button></div>
    </div>
    <div class="card">
      <h3 class="section-title">Room Device Status</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Room</th><th>Building</th><th>AI Camera</th><th>Biometric</th><th>RFID</th></tr></thead>
          <tbody>
            ${APP_DATA.rooms.map(x => `<tr><td>${x.code}</td><td>${x.building}</td><td>${rowStatus(x.aiCamera)}</td><td>${rowStatus(x.biometric)}</td><td>${rowStatus(x.rfid)}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderTimetable(){
  return `
    <div class="topbar">
      <div class="page-title"><h1>Timetable</h1><p>Schedule lecture sessions by lecturer, course, room, and time.</p></div>
      <div class="actions"><button class="btn btn-primary">Add Timetable Entry</button></div>
    </div>
    <div class="card">
      <h3 class="section-title">Weekly Timetable</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Course</th><th>Lecturer</th><th>Room</th><th>Day</th><th>Time</th></tr></thead>
          <tbody>
            ${APP_DATA.timetable.map(x => `<tr><td>${x.course}</td><td>${x.lecturer}</td><td>${x.room}</td><td>${x.day}</td><td>${x.time}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAttendance(){
  return `
    <div class="topbar">
      <div class="page-title"><h1>Attendance Monitor</h1><p>Track entry, exit, in-room duration, and attendance status.</p></div>
      <div class="actions"><button class="btn btn-soft">Filter by Date</button><button class="btn btn-primary">Export Attendance</button></div>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3 class="section-title">Attendance Records</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Lecturer</th><th>Room</th><th>Check In</th><th>Check Out</th><th>Duration</th><th>Status</th></tr></thead>
            <tbody>
              ${APP_DATA.attendance.map(x => `<tr><td>${x.lecturer}</td><td>${x.room}</td><td>${x.checkIn}</td><td>${x.checkOut}</td><td>${x.duration}</td><td>${rowStatus(x.status)}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <h3 class="section-title">Attendance Rules Engine</h3>
        <div class="list">
          <div class="list-item"><strong>Present</strong><div class="muted">Lecturer checked in and remained in the room for the required proportion of scheduled time.</div></div>
          <div class="list-item"><strong>Late</strong><div class="muted">Lecturer entered after the approved session start threshold.</div></div>
          <div class="list-item"><strong>Partial</strong><div class="muted">Lecturer was detected, but total room presence duration was below the required threshold.</div></div>
          <div class="list-item"><strong>Absent</strong><div class="muted">No valid entry/presence confirmation was detected for the scheduled session.</div></div>
        </div>
      </div>
    </div>
  `;
}

function renderReports(){
  return `
    <div class="topbar">
      <div class="page-title"><h1>Reports</h1><p>Management and operational reports for academic supervision and quality assurance.</p></div>
      <div class="actions"><button class="btn btn-primary">Generate Report</button></div>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3 class="section-title">Available Reports</h3>
        <div class="list">
          ${APP_DATA.reports.map(r => `<div class="list-item"><strong>${r.name}</strong><div class="muted">${r.desc}</div></div>`).join('')}
        </div>
      </div>
      <div class="card">
        <h3 class="section-title">Presentation Summary</h3>
        <div class="chart">
          <div class="bars">
            <div class="bar" style="height:72%"><strong>91%</strong><span>ICT</span></div>
            <div class="bar" style="height:58%"><strong>76%</strong><span>Biz</span></div>
            <div class="bar" style="height:80%"><strong>94%</strong><span>Eng</span></div>
            <div class="bar" style="height:63%"><strong>81%</strong><span>Edu</span></div>
          </div>
        </div>
        <div class="footer-note">Department-wise attendance performance simulation.</div>
      </div>
    </div>
  `;
}

function renderAlerts(){
  return `
    <div class="topbar">
      <div class="page-title"><h1>Alerts & Notifications</h1><p>One-hour reminders, late alerts, absences, and device health monitoring.</p></div>
      <div class="actions"><button class="btn btn-primary">Configure Rules</button></div>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3 class="section-title">Recent Alerts</h3>
        <div class="list">
          ${APP_DATA.alerts.map(a => `<div class="list-item"><div class="label-row"><strong>${a.type}</strong><span class="muted">${a.time}</span></div><div class="muted" style="margin-top:8px">${a.message}</div></div>`).join('')}
        </div>
      </div>
      <div class="card">
        <h3 class="section-title">Reminder Configuration</h3>
        <div class="form-grid">
          <div><label class="label">Reminder Trigger</label><input class="input" value="1 hour before lecture" /></div>
          <div><label class="label">Delivery Channels</label><input class="input" value="Email + SMS" /></div>
          <div class="full"><label class="label">Template</label><textarea class="input" rows="7">Dear Lecturer, this is a reminder that your lecture session is scheduled to start in one hour. Please be ready to report to your assigned lecture room on time.</textarea></div>
          <div><button class="btn btn-primary">Save Settings</button></div>
        </div>
      </div>
    </div>
  `;
}

function renderSettings(){
  return `
    <div class="topbar">
      <div class="page-title"><h1>System Settings</h1><p>Presentation-only settings page showing how configuration can look.</p></div>
      <div class="actions"><button class="btn btn-primary">Save Changes</button></div>
    </div>
    <div class="grid-3">
      <div class="card">
        <h3 class="section-title">Institution Settings</h3>
        <div class="form-grid">
          <div class="full"><label class="label">Institution Name</label><input class="input" value="Institution / University / College" /></div>
          <div><label class="label">Academic Year</label><input class="input" value="2026/2027" /></div>
          <div><label class="label">Semester</label><input class="input" value="Semester I" /></div>
        </div>
      </div>
      <div class="card">
        <h3 class="section-title">Attendance Thresholds</h3>
        <div class="form-grid">
          <div><label class="label">Late After</label><input class="input" value="10 minutes" /></div>
          <div><label class="label">Minimum Presence</label><input class="input" value="75%" /></div>
          <div class="full"><label class="label">AI Confidence Threshold</label><input class="input" value="0.85" /></div>
        </div>
      </div>
      <div class="card">
        <h3 class="section-title">Device Sync</h3>
        <div class="list">
          <div class="list-item"><strong>AI Cameras</strong><div class="muted">Connected and ready for live room verification.</div></div>
          <div class="list-item"><strong>Biometric Terminals</strong><div class="muted">Attendance logs can be synced into the central dashboard.</div></div>
          <div class="list-item"><strong>RFID Readers</strong><div class="muted">Room-level lecturer entry and exit capture enabled.</div></div>
        </div>
      </div>
    </div>
  `;
}

function renderPage(page){
  setActive(page);
  const root = document.getElementById('content');
  const map = {
    dashboard: renderDashboard,
    lecturers: renderLecturers,
    rooms: renderRooms,
    timetable: renderTimetable,
    attendance: renderAttendance,
    reports: renderReports,
    alerts: renderAlerts,
    settings: renderSettings
  };
  root.innerHTML = (map[page] || renderDashboard)();
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();

  document.getElementById('demoLoginBtn').addEventListener('click', () => {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('appScreen').classList.remove('hidden');
  });

  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => renderPage(btn.dataset.page));
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    document.getElementById('appScreen').classList.add('hidden');
    document.getElementById('authScreen').classList.remove('hidden');
  });
});
