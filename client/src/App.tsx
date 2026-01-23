import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import Projects from "@/pages/Projects";
import Invoices from "@/pages/Invoices";
import Analytics from "@/pages/Analytics";
import Expenses from "@/pages/Expenses";
import TeamMembers from "@/pages/TeamMembers";
import ClientPortal from "@/pages/ClientPortal";
import ProjectPhotos from "@/pages/ProjectPhotos";
import Reports from "@/pages/Reports";
import Integrations from "@/pages/Integrations";
import Settings from "@/pages/Settings";
import AIInvoiceAssistant from "@/pages/AIInvoiceAssistant";
import ProjectTimeline from "@/pages/ProjectTimeline";
import ClientCommunication from "@/pages/ClientCommunication";
import FinancialDashboard from "@/pages/FinancialDashboard";
import ClientFeedback from "@/pages/ClientFeedback";
import APIDocumentation from "@/pages/APIDocumentation";
import DocumentManagement from "@/pages/DocumentManagement";
import CalendarScheduling from "@/pages/CalendarScheduling";
import InventoryManagement from "@/pages/InventoryManagement";
import PayrollSystem from "@/pages/PayrollSystem";
import MultiLocationSupport from "@/pages/MultiLocationSupport";
import SecurityCompliance from "@/pages/SecurityCompliance";
import WhiteLabel from "@/pages/WhiteLabel";
import AIRecommendations from "@/pages/AIRecommendations";
import AdvancedScheduling from "@/pages/AdvancedScheduling";
import ComplianceHub from "@/pages/ComplianceHub";
import GPSTimeTracking from "@/pages/GPSTimeTracking";
import FinancialIntegration from "@/pages/FinancialIntegration";
import { CarbonAccounting } from "@/pages/CarbonAccounting";
import { Inventory } from "@/pages/Inventory";
import { AdvancedAnalyticsDashboard } from "@/pages/AdvancedAnalyticsDashboard";
import { AIReceptionist } from "@/pages/AIReceptionist";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/client-portal" component={ClientPortal} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/clients" component={Clients} />
      <Route path="/projects" component={Projects} />
      <Route path="/invoices" component={Invoices} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/expenses" component={Expenses} />
      <Route path="/team-members" component={TeamMembers} />
      <Route path="/project-photos" component={ProjectPhotos} />
      <Route path="/reports" component={Reports} />
      <Route path="/integrations" component={Integrations} />
      <Route path="/settings" component={Settings} />
      <Route path="/ai-invoice" component={AIInvoiceAssistant} />
      <Route path="/project-timeline" component={ProjectTimeline} />
      <Route path="/client-communication" component={ClientCommunication} />
      <Route path="/financial-dashboard" component={FinancialDashboard} />
      <Route path="/client-feedback" component={ClientFeedback} />
      <Route path="/api-documentation" component={APIDocumentation} />
      <Route path="/documents" component={DocumentManagement} />
      <Route path="/calendar" component={CalendarScheduling} />
      <Route path="/inventory" component={InventoryManagement} />
      <Route path="/payroll" component={PayrollSystem} />
      <Route path="/multi-location" component={MultiLocationSupport} />
      <Route path="/security" component={SecurityCompliance} />
      <Route path="/white-label" component={WhiteLabel} />
      <Route path="/ai-recommendations" component={AIRecommendations} />
      <Route path="/advanced-scheduling" component={AdvancedScheduling} />
      <Route path="/compliance" component={ComplianceHub} />
      <Route path="/gps-time-tracking" component={GPSTimeTracking} />
      <Route path="/financial-integration" component={FinancialIntegration} />
      <Route path="/carbon-accounting" component={CarbonAccounting} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/advanced-analytics" component={AdvancedAnalyticsDashboard} />
      <Route path="/ai-receptionist" component={AIReceptionist} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
