import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'basics',
    pathMatch: 'full'
  },
  {
    path: 'basics',
    loadChildren: () => import('../staff-research/basic/basic.module').then(m => m.BasicModule)
  },
  {
    path: 'identities',
    loadChildren: () => import('../staff-research/personal-identity/personal-identity.module').then(m => m.PersonalIdentityModule)
  },
  {
    path: 'bank-accounts',
    loadChildren: () => import('../staff-research/bank-account/bank-account.module').then(m => m.BankAccountModule)
  },
  {
    path: 'family-relationships',
    loadChildren: () => import('../staff-research/family-relationship/family-relationship.module').then(m => m.FamilyRelationshipModule)
  },
  {
    path: 'worked-histories',
    loadChildren: () => import('../staff-research/worked-history/worked-history.module').then(m => m.WorkedHistoryModule)
  },
  {
    path: 'work-process',
    loadChildren: () => import('../staff-research/work-process/work-process.module').then(m => m.WorkProcessModule)
  },
  {
    path: 'concurrent-process',
    loadChildren: () => import('../staff-research/concurrent-process/concurrent-process.module').then(m => m.ConcurrentProcessModule)
  },
  {
    path: 'contract-process',
    loadChildren: () => import('../staff-research/contract-process/contract-process.module').then(m => m.ContractProcessModule)
  },
  {
    path: 'education-degrees',
    loadChildren: () => import('../staff-research/education-degrees/education-degrees.module').then(m => m.EducationDegreesModule)
  },
  {
    path: 'education-certificates',
    loadChildren: () => import('../staff-research/education-certificate/education-certificate.module').then(m => m.EducationCertificateModule)
  },
  {
    path: 'education-process',
    loadChildren: () => import('../staff-research/education-process/education-process.module').then(m => m.EducationProcessModule)
  },
  {
    path: 'insurance-salary-process',
    loadChildren: () => import('../staff-research/insurance-salary-process/insurance-salary-process.module').then(m => m.InsuranceSalaryProcessModule)
  },
  {
    path: 'allowance-process',
    loadChildren: () => import('../staff-research/allowance-process/allowance-process.module').then(m => m.AllowanceProcessModule)
  },
  {
    path: 'award-process',
    loadChildren: () => import('../staff-research/award-process/award-process.module').then(m => m.AwardProcessModule)
  },
  {
    path: 'discipline-process',
    loadChildren: () => import('../staff-research/discipline-process/discipline-process.module').then(m => m.DisciplineProcessModule)
  },
  {
    path: 'evaluation-results',
    loadChildren: () => import('../staff-research/evaluation-results/evaluation-results.module').then(m => m.EvaluationResultsModule)
  },
  {
    path: 'education-promotions',
    loadChildren: () => import('../staff-research/education-promotion/education-promotion.module').then(m => m.EducationPromotionModule)
  },
  {
    path: 'position-salary-process',
    loadChildren: () => import('../staff-research/position-salary-process/position-salary-process.module').then(m => m.PositionSalaryProcessModule)
  },
  {
    path: 'political-participations',
    loadChildren: () => import('../staff-research/participation/participation.module').then(m => m.ParticipationModule)
  },
  {
    path: 'planning-assignments',
    loadChildren: () => import('../staff-research/planning-assignments/planning-assignments.module').then(m => m.PlanningAssignmentsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffResearchRoutingModule {
}
