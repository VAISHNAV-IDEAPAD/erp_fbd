$base = "src\pages\mm"

$pages = @(
    @{Folder="stockIndent";File="StockIndents.jsx";Component="StockIndents";Title="Stock Indent"},
    @{Folder="indentApproval";File="IndentApproval.jsx";Component="IndentApproval";Title="Indent Approval"},
    @{Folder="purchaseReturn";File="PurchaseReturns.jsx";Component="PurchaseReturns";Title="Purchase Return"},
    @{Folder="rejectionReturn";File="RejectionReturns.jsx";Component="RejectionReturns";Title="Rejection Return"},
    @{Folder="itemReceipt";File="ItemReceipts.jsx";Component="ItemReceipts";Title="Item Receipt"},
    @{Folder="gateEntry";File="GateEntries.jsx";Component="GateEntries";Title="Gate Entry"},
    @{Folder="itemIssue";File="ItemIssues.jsx";Component="ItemIssues";Title="Item Issue"},
    @{Folder="floorReturn";File="FloorReturns.jsx";Component="FloorReturns";Title="Floor Return"},
    @{Folder="storeTransfer";File="StoreTransfers.jsx";Component="StoreTransfers";Title="Store Transfer"},
    @{Folder="gatePassDelivery";File="GatePassDeliveries.jsx";Component="GatePassDeliveries";Title="Gate Pass Delivery"},
    @{Folder="itemRequisition";File="ItemRequisitions.jsx";Component="ItemRequisitions";Title="Item Requisition"},
    @{Folder="gatePassGRN";File="GatePassGRN.jsx";Component="GatePassGRN";Title="Gate Pass GRN"},
    @{Folder="stockTransferDC";File="StockTransferDC.jsx";Component="StockTransferDC";Title="Stock Transfer DC"},
    @{Folder="stockTransferGRN";File="StockTransferGRN.jsx";Component="StockTransferGRN";Title="Stock Transfer GRN"},
    @{Folder="grnHandOver";File="GRNHandOver.jsx";Component="GRNHandOver";Title="GRN HandOver"},
    @{Folder="incomingInspection";File="IncomingInspection.jsx";Component="IncomingInspection";Title="Incoming Material Inspection"},
    @{Folder="stockConversion";File="StockConversion.jsx";Component="StockConversion";Title="Stock Conversion"},
    @{Folder="materialPlanning";File="MaterialPlanning.jsx";Component="MaterialPlanning";Title="Material Planning"}
)

foreach ($p in $pages) {

    $folder = Join-Path $base $p.Folder

    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
    }

    $file = Join-Path $folder $p.File

    $content = @"
import React from "react";

export default function $($p.Component)() {
    return (
        <div className="container mt-4">
            <h2>$($p.Title)</h2>
            <p>$($p.Title) Module</p>
        </div>
    );
}
"@

    Set-Content -Path $file -Value $content

    Write-Host "Created: $file"
}

Write-Host ""
Write-Host "===================================="
Write-Host "All MM Pages Created Successfully!"
Write-Host "===================================="