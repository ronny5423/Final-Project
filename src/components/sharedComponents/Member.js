import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import '../cssComponents/About.css'

export default function Member({img, name, job, description}) {
    return (
        <div class="col-lg-4">
            <div class="team-member">
                <img class="mx-auto rounded-circle" src={img} alt="" />
                <h4>{name}</h4>
                <p class="text-muted">{job}</p>
                <p class="text-muted">{description}</p>
                <a class="btn btn-dark btn-social mx-2" href="#!"><FontAwesomeIcon icon={faTwitter} /></a>
                <a class="btn btn-dark btn-social mx-2" href="#!"><FontAwesomeIcon icon={faFacebookF} /></a>
                <a class="btn btn-dark btn-social mx-2" href="#!"><FontAwesomeIcon icon={faLinkedinIn} /></a>
            </div>
        </div>
    )
}