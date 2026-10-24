import { Ticket } from "./ticket.js";
import { loadTickets, saveTickets } from "./storage.js";

let tickets = loadTickets().map(ticket => new Ticket(ticket));
let editingId = null;

const $ = selector => document.querySelector(selector);

const form = $("#ticketForm");
const customerName = $("#customerName");
const issue = $("#issue");
const priority = $("#priority");
const status = $("#status");
const ticketId = $("#ticketId");
const tableBody = $("#ticketTableBody");
const emptyState = $("#emptyState");
const resultCount = $("#resultCount");
const alertBox = $("#alertBox");

const statusClass = statusValue => ({
  "Open": "badge-open",
  "In Progress": "badge-progress",
  "Closed": "badge-closed"
}[statusValue] || "");

const priorityClass = priorityValue => ({
  "Low": "badge-low",
  "Medium": "badge-medium",
  "High": "badge-high"
}[priorityValue] || "");

const escapeHtml = value => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const formatDate = isoDate => new Intl.DateTimeFormat("en-PK", {
  year: "numeric",
  month: "short",
  day: "numeric"
}).format(new Date(isoDate));

const generateId = () => {
  const maxNumber = tickets.reduce((max, ticket) => {
    const number = Number(ticket.id.replace("T-", ""));
    return Number.isFinite(number) ? Math.max(max, number) : max;
  }, 1000);
  return `T-${maxNumber + 1}`;
};

const showAlert = (message, type = "success") => {
  alertBox.innerHTML = `<div class="alert alert-${type} py-2">${escapeHtml(message)}</div>`;
  setTimeout(() => {
    alertBox.innerHTML = "";
  }, 2500);
};

const validateForm = () => {
  let valid = true;

  [customerName, issue, priority].forEach(input => input.classList.remove("is-invalid"));

  if (customerName.value.trim() === "") {
    customerName.classList.add("is-invalid");
    valid = false;
  }

  if (issue.value.trim().length < 5) {
    issue.classList.add("is-invalid");
    valid = false;
  }

  if (!["Low", "Medium", "High"].includes(priority.value)) {
    priority.classList.add("is-invalid");
    valid = false;
  }

  return valid;
};

const resetForm = () => {
  form.reset();
  ticketId.value = "";
  status.value = "Open";
  editingId = null;
  $("#formTitle").textContent = "Create Ticket";
  $("#saveBtn").textContent = "Add Ticket";
  [customerName, issue, priority].forEach(input => input.classList.remove("is-invalid"));
};

const updateSummary = () => {
  const total = tickets.length;
  const summary = tickets.reduce((counts, { status }) => {
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});

  $("#totalCount").textContent = total;
  $("#openCount").textContent = summary["Open"] || 0;
  $("#progressCount").textContent = summary["In Progress"] || 0;
  $("#closedCount").textContent = summary["Closed"] || 0;
};

const getFilteredTickets = () => {
  const search = $("#searchInput").value.trim().toLowerCase();
  const selectedStatus = $("#statusFilter").value;
  const selectedPriority = $("#priorityFilter").value;

  return tickets
    .filter(({ customerName, issue }) => {
      const searchable = `${customerName} ${issue}`.toLowerCase();
      return !search || searchable.includes(search);
    })
    .filter(({ status }) => selectedStatus === "All" || status === selectedStatus)
    .filter(({ priority }) => selectedPriority === "All" || priority === selectedPriority);
};

const renderTickets = () => {
  const filtered = getFilteredTickets();
  resultCount.textContent = filtered.length;

  tableBody.innerHTML = filtered.map(ticket => {
    const { id, customerName, issue, priority, status, createdAt } = ticket;

    return `
      <tr>
        <td>
          <div class="fw-semibold">${escapeHtml(customerName)}</div>
          <small class="text-muted">${escapeHtml(id)}</small>
        </td>
        <td class="issue-cell">
          <div class="issue-text" title="${escapeHtml(issue)}">${escapeHtml(issue)}</div>
        </td>
        <td><span class="badge rounded-pill badge-priority ${priorityClass(priority)}">${escapeHtml(priority)}</span></td>
        <td><span class="badge rounded-pill badge-status ${statusClass(status)}">${escapeHtml(status)}</span></td>
        <td class="text-nowrap">${formatDate(createdAt)}</td>
        <td class="text-end text-nowrap">
          <button class="action-btn action-edit" data-action="edit" data-id="${id}">Edit</button>
          <button class="action-btn action-delete" data-action="delete" data-id="${id}">Delete</button>
        </td>
      </tr>
    `;
  }).join("");

  emptyState.classList.toggle("d-none", filtered.length !== 0);
  updateSummary();
};

const startEdit = id => {
  const ticket = tickets.find(item => item.id === id);
  if (!ticket) return;

  const { customerName: name, issue: ticketIssue, priority: ticketPriority, status: ticketStatus } = ticket;
  customerName.value = name;
  issue.value = ticketIssue;
  priority.value = ticketPriority;
  status.value = ticketStatus;
  ticketId.value = id;
  editingId = id;

  $("#formTitle").textContent = "Edit Ticket";
  $("#saveBtn").textContent = "Update Ticket";
  $("#formSection").scrollIntoView({ behavior: "smooth", block: "start" });
};

const deleteTicket = id => {
  const ticket = tickets.find(item => item.id === id);
  if (!ticket) return;

  if (!confirm(`Delete ticket ${id} for ${ticket.customerName}?`)) return;

  tickets = tickets.filter(item => item.id !== id);
  saveTickets(tickets);
  renderTickets();
  showAlert("Ticket deleted successfully.");
};

form.addEventListener("submit", event => {
  event.preventDefault();

  if (!validateForm()) {
    showAlert("Please correct the highlighted fields.", "danger");
    return;
  }

  const ticketData = {
    customerName: customerName.value,
    issue: issue.value,
    priority: priority.value,
    status: status.value
  };

  if (editingId) {
    const ticket = tickets.find(item => item.id === editingId);
    if (ticket) {
      ticket.update(ticketData);
      showAlert("Ticket updated successfully.");
    }
  } else {
    tickets = [...tickets, new Ticket({
      id: generateId(),
      ...ticketData
    })];
    showAlert("Ticket added successfully.");
  }

  saveTickets(tickets);
  resetForm();
  renderTickets();
});

$("#resetBtn").addEventListener("click", resetForm);
$("#newTicketBtn").addEventListener("click", () => {
  resetForm();
  customerName.focus();
});

["searchInput", "statusFilter", "priorityFilter"].forEach(id => {
  $(`#${id}`).addEventListener("input", renderTickets);
  $(`#${id}`).addEventListener("change", renderTickets);
});

tableBody.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;
  if (action === "edit") startEdit(id);
  if (action === "delete") deleteTicket(id);
});

renderTickets();
