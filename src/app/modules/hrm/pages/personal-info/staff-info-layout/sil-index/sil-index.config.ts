import { FunctionCode } from '@app/shared/enums/enums-constant';
import { PinIndexComponent } from '@app/modules/hrm/pages/personal-info/personal-information/pin-index/pin-index.component';
import { EducationInformationComponent } from '@app/modules/hrm/pages/personal-info/education-information/ein-index/education-information.component';
import { AwardInformationComponent } from '@app/modules/hrm/pages/personal-info/award-information/ain-index/award-information.component';
import { FrsIndexComponent } from '@app/modules/hrm/pages/personal-info/family-relationships/frs-index/frs-index.component';
import { PioIndexComponent } from '@app/modules/hrm/pages/personal-info/policy-info/pio-index/pio-index.component';
import { PioFormComponent } from '@app/modules/hrm/pages/personal-info/policy-info/pio-form/pio-form.component';
import { BasicFormComponent } from '@app/modules/hrm/pages/staff-research/basic/basic-form/basic-form.component';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { WinComponent } from '../../work-information/win-index/win.component';

export const PANELS_INFORMATION: any[] = [
  {
    id: 'personal_information',
    active: true,
    disabled: false,
    icon: 'assets/icon/staff-manager/personal-info.svg',
    code: FunctionCode.PERSONAL_INFO,
    name: 'hrm.staffManager.panel.personalInformation',
    panelComponent: PinIndexComponent,
    extraMode: [
      {
        type: 'EDIT_MODAL',
        contentHeader: 'hrm.staffManager.label.basicInfo',
        content: BasicFormComponent,
        config: UrlConstant.EMPLOYEES.PERSONAL_CT
      }
    ]
  },
  {
    id: 'personal_family_relationship_information',
    active: true,
    disabled: false,
    icon: 'assets/icon/staff-manager/list-alt.svg',
    code: FunctionCode.PERSONAL_FAMILY_RELATIONSHIPS,
    name: 'hrm.staffManager.panel.familyRelationships',
    panelComponent: FrsIndexComponent,
  },
  {
    id: 'personal_education_information',
    active: true,
    disabled: false,
    icon: 'assets/icon/staff-manager/list-alt.svg',
    code: FunctionCode.PERSONAL_EDUCATION_PROCESS,
    name: 'hrm.staffManager.panel.educationInformation',
    panelComponent: EducationInformationComponent,
  },
  {
    id: 'personal_work_information',
    active: true,
    disabled: false,
    icon: 'assets/icon/staff-manager/list-alt.svg',
    code: FunctionCode.PERSONAL_WORK_PROCESS,
    name: 'hrm.staffManager.panel.workInformation',
    panelComponent: WinComponent,
  },
  {
    id: 'personal_award_information',
    active: true,
    disabled: false,
    icon: 'assets/icon/staff-manager/list-alt.svg',
    code: FunctionCode.PERSONAL_AWARD_PROCESS,
    name: 'hrm.staffManager.panel.rewardHisInformation',
    panelComponent: AwardInformationComponent,
  },
  {
    id: 'personal_policy_information',
    active: true,
    disabled: false,
    icon: 'assets/icon/staff-manager/list-alt.svg',
    code: FunctionCode.PERSONAL_POLITICAL_INFO,
    name: 'hrm.staffManager.panel.policyInformation',
    panelComponent: PioIndexComponent,
    extraMode: [
      {
        type: 'EDIT_MODAL',
        content: PioFormComponent,
        contentHeader: 'hrm.staffManager.panel.policyInformation'
      }
    ]
  }
];

export const SCROLL_TABS_DATA = [
  {
    title: 'hrm.staffManager.panel.personalInformation',
    code: FunctionCode.PERSONAL_INFO,
    scrollTo: 'personal_information'
  },
  {
    title: 'hrm.staffManager.panel.educationInformation',
    code: FunctionCode.PERSONAL_EDUCATION_PROCESS,
    scrollTo: 'personal_education_information'
  },
  {
    title: 'hrm.staffManager.panel.workInformation',
    code: FunctionCode.PERSONAL_WORK_PROCESS,
    scrollTo: 'personal_work_information'
  },
  {
    title: 'hrm.staffManager.panel.rewardHisInformation',
    code: FunctionCode.PERSONAL_AWARD_PROCESS,
    scrollTo: 'personal_award_information'
  }
];
