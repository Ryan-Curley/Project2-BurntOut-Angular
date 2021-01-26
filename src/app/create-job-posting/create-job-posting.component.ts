import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CreateJobService } from '../services/create-job.service';
import { JobPosting } from '../services/jobPosting';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-create-job-posting',
  templateUrl: './create-job-posting.component.html',
  styleUrls: ['./create-job-posting.component.css']
})
export class CreateJobPostingComponent implements OnInit {

  company_id:number;
  poster_id:number = JSON.parse(localStorage.getItem('user')).userId;
  title:string;
  location_id:string;
  industry_id:string;
  description:string;

  jobPosting:JobPosting = {'company_id': 1,
  'poster_id': 0,
  'title': '',
  'location_name': '',
  'industry_name': '',
  'description': '',
  'location_id': 0,
  'industry_id': 0,
};

  jobgroup = new FormGroup({
    company_id: new FormControl(''),
    poster_id: new FormControl(''),
    title: new FormControl(''),
    location: new FormControl(''),
    industry: new FormControl(''),
    description: new FormControl(''),
  })

  constructor(private createJobServ: CreateJobService, private sessServ: SessionService) { }

  jobPost(jobgroup :FormGroup){

    this.jobPosting.company_id = this.company_id;
    this.jobPosting.poster_id = this.poster_id;
    this.jobPosting.title = jobgroup.get('title').value;
    this.jobPosting.location_name = jobgroup.get('location').value;
    this.jobPosting.industry_name = jobgroup.get('industry').value;
    this.jobPosting.description = jobgroup.get('description').value;


    this.createJobServ.postJob(this.jobPosting).subscribe(
      response=>{
          window.alert("Job Posting created");
      },error=>{
          window.alert("Could not create posting");
      }
    );

  }

  ngOnInit(): void {
    if(this.sessServ.verifySession()){

    } else {
      window.location.href = '/login';
    }
    var name = JSON.parse(localStorage.getItem('user')).companyName;
    this.getJobId(name);
  }

  getJobId(jobName: String): void {
   
    this.createJobServ.getCompanyId(jobName).subscribe (
      response => {
       this.company_id =  Number.parseInt(response.toString());
      }
    )
  }
 

}
