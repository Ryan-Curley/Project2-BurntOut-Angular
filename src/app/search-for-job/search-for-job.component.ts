import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Job } from '../services/job';
import { JobService } from '../services/job.service';
import { SessionService } from '../services/session.service';
import { Tag } from '../services/tag';

@Component({
  selector: 'app-search-for-job',
  templateUrl: './search-for-job.component.html',
  styleUrls: ['./search-for-job.component.css']
})
export class SearchForJobComponent implements OnInit {
  pageTitle = "Search for a job";
  firstName : string = "";
  lastName : string = "";
  username : string = "";

  @Input()
  jobPostingId : number;

  jobs : Job [];

  jobsFilteredByName : Job [] = [];

  constructor(private router : Router, private jobServ : JobService, private sessServ: SessionService) {
   }

   ngOnInit() {
    this.getAllJobs();
  }

   get postingId() : number {
     return this.jobPostingId;
   }

   set postingId(temp : number) {
     this.jobPostingId = temp;
   }

 
  jobsByNameFilterString = "";

  get jobsByNameFilter() : string {
    return this.jobsByNameFilterString;
  }

  set jobsByNameFilter(temp:string) {
    this.jobsByNameFilterString = temp;
    this.jobsFilteredByName = this.jobsByNameFilterString ? 
    this.performFilter(this.jobsByNameFilterString) : this.jobs;
}

performFilter(filterBy:string) : Job[] {
    filterBy = filterBy.toLowerCase();
    return this.jobs.filter((job:Job)=> {
      if (job.tagsList.length > 0) {
        job.tagNames = "";
        job.tagsList.forEach(tag => {
          let thisName = tag.tag;
          job.tagNames = job.tagNames + thisName;
        });
      }

    else {
      job.tagNames = "";
    }
    
        return (job.title.toLowerCase().indexOf(filterBy) !==-1) 
                || (job.locationName.toLowerCase().indexOf(filterBy) !==-1)
                || (job.companyName.toLowerCase().indexOf(filterBy) !==-1)
                || (job.industryName.toLowerCase().indexOf(filterBy) !==-1)
                || (job.tagNames.toLowerCase().indexOf(filterBy) !==-1)              
    });
}


  getAllJobs() : void {
    let thisArray : Job [];
    this.jobServ.retrieveAllJobs().subscribe (
      response => {
        thisArray = Object.values(response);
        this.jobs = thisArray;
        console.log(this.jobs);
      }
    )
  }

  goToAppFormPage(pId) : void {
    this.jobPostingId = pId;
    localStorage.setItem("postingId", JSON.stringify(this.jobPostingId));
    this.router.navigate(['jobs/application']);
  }

}
