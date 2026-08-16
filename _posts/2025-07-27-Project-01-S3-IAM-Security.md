---
layout: post
title: "Project 01: Securing Your First S3 Bucket & IAM User"
date: 2025-07-27
categories:
  - AWS Projects
tags:
  - S3
  - IAM
  - Bucket
  - Policy
  - Security
description: Beginner-friendly project to understand S3 misconfigurations, IAM policies, and securing your AWS resources the right way.
---

![Securing Your First S3 Bucket Project](/assets/img/s3-iam-project/your-header-image.png)


## 🔐 Project 1: Securing Your First S3 Bucket & IAM User — Guided by a Security <span class="strike">Engineer</span>

> _A Beginner’s Journey into S3 Security and IAM - Guided by a Security Engineer_


### 🎯 <span class="strike">**Objective</span>**

> **Help beginners understand how simple misconfigurations in S3 buckets and IAM policies can expose sensitive data - and how to fix them securely.**

As a Security Engineer, I’ve seen how frequently these issues occur in real-world environments. 

In this project, I will walk you through intentionally misconfiguring an S3 bucket to simulate a common security mistake, and then fixing it step by step - just like I would in a real audit.

---

### 🧰 Tools You’ll <span class="strike">Use</span>

- ✅ AWS Console (GUI)
- ✅ Amazon S3
- ✅ AWS IAM
- ✅ AWS CLI _(Optional – for those wanting to level up)_

---
## 🔧 What We’ll <span class="strike">Do</span>

You’ll simulate a real-world misconfiguration:

- An S3 bucket made public (accidentally or lazily)
- An IAM user given broad permissions (think: intern with admin rights 😬)

Then, you’ll **detect**, **fix**, and **harden** the setup using:

- IAM best practices (least privilege)
- Secure S3 bucket policies
- Logging for audit trails

---


## 🧠 Why This Project <span class="strike">Matters</span>

> **“S3 bucket leaks are a cloud security engineer’s worst recurring nightmare.”**  
   Misconfigured buckets have exposed sensitive data from startups to Fortune 500s. Why? Because it's **easy to get wrong**, and **hard to notice** until someone tweets it.

Same with IAM users:

> Giving full access without restriction is like giving keys to your house to someone who just asked where the bathroom is.

So let’s **learn to break it**, **spot the danger**, and then **secure it like a pro**.

---

# 🚀 Step-by-Step <span class="strike">Implementation</span>


### 🛠️ Step-by-Step <span class="strike">Guide</span>

> Think of this as a **security lab exercise** - we simulate the misconfiguration, then fix it, all while learning key IAM and S3 security concepts




### ✅ Step 1: Create an S3 <span class="strike">Bucket</span>


📌 Bucket Name: `your-name-cloudsec-demo`

✅ Go to **S3 → Create bucket**  
✅ Name it something like: `aakash-cloudsec-demo`  
✅ Use default region (or choose one you prefer)  
✅ **Disable block all public access** _(this is the misconfiguration step we'll fix later)_  
✅ Keep default settings → Create bucket

🔒 **Security Insight:** 

Disabling public access is dangerous unless you **really** need public files. Many data leaks happen this way.


📌 NOTE:  **S3 Buckets are global-named. Use a unique name.**


![](/assets/img/s3-iam-project/20250727164102.png)


![](/assets/img/s3-iam-project/20250727161740.png)

![](/assets/img/s3-iam-project/20250727162652.png)

![](/assets/img/s3-iam-project/20250727162739.png)

![](/assets/img/s3-iam-project/20250727173343.png)


![](/assets/img/s3-iam-project/20250727173409.png)



---

### ✅ Step 2: Upload a Sample Sensitive <span class="strike">File</span>


📄 File Name: `sensitive.txt`  
📝 Content: You can add something like:

```json
Internal Project Credentials:
DB_USERNAME=admin
DB_PASSWORD=123456
```

✅ Upload it to the bucket under **Objects → Upload**.

**aakash-cloudsec-demo** -> this is your object

![](/assets/img/s3-iam-project/20250727174208.png)


![](/assets/img/s3-iam-project/20250727174239.png)


![](/assets/img/s3-iam-project/20250727174320.png)

![](/assets/img/s3-iam-project/20250727174337.png)


![](/assets/img/s3-iam-project/20250727174402.png)


---

### ✅ Step 3: Make the Bucket Public (Simulate <span class="strike">Misconfiguration</span>)

> 🎯 Simulating what often goes wrong in the real world

- Go to the bucket → **Permissions tab**
- Scroll down to **Bucket Policy**
- Paste the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::aakash-cloudsec-demo/*"
    }
  ]
}
```

This means:

- ✅ Anyone (`"Principal": "*"`) on the internet can `GetObject` - i.e., **download** files from this bucket.
- ✅ The access is for **all objects** (`/*`) inside the bucket


✅ Save policy  
✅ Try opening the file in **public browser tab** - You’ll see it’s now accessible without login.


#### Before ->

![](/assets/img/s3-iam-project/20250727174824.png)

or

![](/assets/img/s3-iam-project/20250727174855.png)


When Open this file in browser -> 

![](/assets/img/s3-iam-project/20250727174928.png)


#### NOW ->

![](/assets/img/s3-iam-project/20250727175017.png)

![](/assets/img/s3-iam-project/20250727175113.png)

![](/assets/img/s3-iam-project/20250727175125.png)


Now able to see in public ->

![](/assets/img/s3-iam-project/20250727175222.png)






> This simulates how even a small policy mistake can expose private files. 
> In real-life, attackers often scan for such misconfigured buckets


**AWS honors this policy** because there's no block in place - i.e -> **Block All Public Access is DISABLED**


##### What happen if -> **Block All Public Access is ENABLED** ?

even if your **bucket policy says “Allow public access”**, AWS will **block it anyway**.

In short:

- ❌ Public policy is **ignored** which we set earlier
- ❌ File becomes **inaccessible**
- 🔐 Even though the policy _says_ “Allow anyone,” the **block setting overrides it**


##### 🔒 Behind the Scenes (What AWS Does)

When **Block Public Access is enabled**, AWS does these enforcement-level things:

- Rejects any **new bucket policies** that try to allow `"Principal": "*"`
- Ignores **existing public policies** when evaluating access
- Blocks **ACL-based public grants** (like `AllUsers`, `AuthenticatedUsers`)
- Ensures **cross-account public access** is also blocked unless explicitly allowed



---

### ✅ Step 4: Create an IAM User – <span class="strike">`junior-analyst</span>`

✅ Go to IAM → Users → Add User  
✅ Username: `junior-analyst`  
✅ Access Type: **Programmatic Access** (CLI access)  
✅ Attach **S3FullAccess** managed policy temporarily  
✅ Download the credentials

🛡️ **Security Insight:** Giving full access to S3 is too much! We’ll restrict it soon.


![](/assets/img/s3-iam-project/20250727180343.png)


![](/assets/img/s3-iam-project/20250727180423.png)


![](/assets/img/s3-iam-project/20250727180447.png)

![](/assets/img/s3-iam-project/20250727180711.png)


![](/assets/img/s3-iam-project/20250727180805.png)


![](/assets/img/s3-iam-project/20250727180832.png)


![](/assets/img/s3-iam-project/20250727180849.png)


![](/assets/img/s3-iam-project/20250727180938.png)

![](/assets/img/s3-iam-project/20250727181205.png)


![](/assets/img/s3-iam-project/20250727181245.png)


❌ Why This Is a Security Problem ?

The policy **AmazonS3FullAccess** grants access to **every bucket** in your AWS account. 

Here's what it looks like:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": "*"
    }
  ]
}
```

🧨 **What’s wrong with this?**

- ✅ `Action: "s3:*"` - Can do anything in S3 (delete, update, list, copy…)
- ✅ `Resource: "*"` - On **all buckets and objects**

> 🚨 This violates **Principle of Least Privilege** -  an attacker with these keys can compromise everything in S3.


---

### ✅ Step 5: Fix the <span class="strike">Misconfiguration</span>

Finally where we are going to fix the misconfiguration

##### ✅ Remove Public Access

- Go to S3 → Permissions tab → Delete the public bucket policy

![](/assets/img/s3-iam-project/20250727182014.png)

![](/assets/img/s3-iam-project/20250727182034.png)


![](/assets/img/s3-iam-project/20250727182049.png)


##### ✅ Block All Public Access

- In bucket settings → Enable **“Block all public access”**

![](/assets/img/s3-iam-project/20250727182141.png)


Before ->

![](/assets/img/s3-iam-project/20250727182201.png)


After ->

![](/assets/img/s3-iam-project/20250727182221.png)

![](/assets/img/s3-iam-project/20250727182234.png)


![](/assets/img/s3-iam-project/20250727182252.png)


Now -> 

![](/assets/img/s3-iam-project/20250727182416.png)




##### ✅ Create a Custom IAM Policy for Least Privilege

* Go to IAM → Policies → Create Policy → JSON

![](/assets/img/s3-iam-project/20250727182520.png)

![](/assets/img/s3-iam-project/20250727182617.png)


![](/assets/img/s3-iam-project/20250727182853.png)

Replace below json policy 

![](/assets/img/s3-iam-project/20250727182917.png)


With below Policy:


```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::aakash-cloudsec-demo"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::aakash-cloudsec-demo/*"
    }
  ]
}

```

![](/assets/img/s3-iam-project/20250727183105.png)


![](/assets/img/s3-iam-project/20250727183205.png)


Then **Create Policy**

✅ Replace bucket name accordingly  
✅ Attach this policy to `junior-analyst` user  
✅ Remove `AmazonS3FullAccess` policy

🔒 **Security Insight:** This enforces the **Principle of Least Privilege** - give only what is needed.




![](/assets/img/s3-iam-project/20250727183411.png)

![](/assets/img/s3-iam-project/20250727183534.png)

![](/assets/img/s3-iam-project/20250727183546.png)

![](/assets/img/s3-iam-project/20250727183608.png)


## 🔐 Policy Comparison: Before vs After <span class="strike">Fix</span>

| Policy               | Access Level       | Bucket Scope        | Security Risk |
| -------------------- | ------------------ | ------------------- | ------------- |
| `AmazonS3FullAccess` | s3:* (all actions) | All buckets         | 🟥 High       |
| Custom Policy        | Only List/Get/Put  | One specific bucket | ✅ Safe        |



---

### ✅ Step 6: Enable S3 Server Access <span class="strike">Logging</span>


✅ Create a new Bucket -> `log-bucket-yourname`
✅ Go to **S3 → Bucket -> Properties -> Server Access Logging**  
✅ Enable Server Access Logging  
✅ Target bucket: `log-bucket-yourname`  


![](/assets/img/s3-iam-project/20250727185905.png)

![](/assets/img/s3-iam-project/20250727190114.png)


![](/assets/img/s3-iam-project/20250727190132.png)





📘 This enables **auditing**: now you can track access and detect anomalies in S3 access patterns.

---


## 🔥 Let's recap what we did in STEP 5 :

**We Fixed the security risk** caused by the earlier misconfiguration:

- We removed public access.
- We applied least-privilege IAM policies.
- We blocked unauthorized users.

But…

> ❓What if something **still goes wrong**?  
> ❓How do we know **who accessed what**, and **when**?

That’s where **logging** comes in.


That's why we **ENABLED** -> **S3 Server Access Logging** in last of STEP 5

Let's learn about this ->

S3 Server Access Logging is a **built-in AWS feature** that records detailed logs for **every request made to your S3 bucket**.

Each log entry answers:

- 👤 **Who** accessed the bucket?
- 🕒 **When** did the access occur?
- 🎯 **Which file** was accessed or modified?
- 🌐 From **which IP address or AWS account**?
- 💥 Was it **successful** or denied?

It’s like turning on CCTV cameras for your S3 storage.


So -> ✅  It Helps in Auditing and even ✅ Detect Misuse or Malicious Activity

🔧 Fixing a misconfiguration is only **half the solution**.  
🕵️‍♂️ **Detecting if someone already exploited it** or **is trying to** - is the other half.

## ⚙️ How It Works (Behind the <span class="strike">Scenes</span>)

When you enable Server Access Logging:

- S3 writes access logs in a **.log format** to the **target bucket** (e.g., `log-bucket-yourname`)
- These logs are stored as objects inside folders like:
```json
logs/AWSLogs/AccountID/S3/BucketName/yyyy-mm-dd-HH-MM-SS-UUID
```

Each log line contains fields like:

```json
79a5 EXAMPLEBUCKET [27/Jul/2025:14:55:05 +0000] 192.0.2.3 arn:aws:iam::123456789:user/Junior-Analyst REST.GET.OBJECT sensitive.txt 200 -
```

By This We can ->

- Analyze them using **Athena** or **CloudWatch**
- Set alerts for unusual behavior
- Store them for 90+ days as evidence



## ⚠️ Common Mistake Beginners <span class="strike">Make</span>

- They fix a misconfigured policy
- But forget to **turn on logging**
- So if someone **already accessed** the bucket, they **won’t know it happened** 😱

As a Security Engineer, you should always **log before you relax.**

---

# BONUS - IAM Policy for S3 <span class="strike">Bucket</span>

In our misconfguration steps we added Policy to Access Specific S3 Bucket and Object to IAM User

But now let's add another Policy this time directly to S3 Bucket to allow Specific IAM User only to access the Object and Bucket

### Here are the Steps ->

✅ Go To S3 Bucket
✅ Go to Permission Tab
✅ Add the following Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowJuniorAnalystAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::677604542474:user/junior-analyst"
      },
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::aakash-cloudsec-demo",
        "arn:aws:s3:::aakash-cloudsec-demo/*"
      ]
    }
  ]
}

```


![](/assets/img/s3-iam-project/20250727184410.png)


✅  Save Changes

### ✅ What This Policy Is <span class="strike">Doing</span>

🔐 This is a **Bucket Policy** that says:

> "Allow the IAM User named **junior-analyst** from Account **677604542474** to perform **all S3 actions (`s3:*`)** on this bucket and all its objects."

📌 **Where is this attached?**  
This is placed **directly on the S3 bucket** → under _Permissions > Bucket Policy_

🧠 **What does that mean?**

- The access control is defined **at the resource level** (S3 bucket).
- The bucket **trusts a specific IAM user**, and gives it permission.
- You must still ensure that IAM **allows** the action too - it must match both bucket + IAM permissions.

## 🔄 So… What’s the <span class="strike">Difference</span>?

| Feature           | **Bucket Policy**                       | **IAM Policy**                 |
| ----------------- | --------------------------------------- | ------------------------------ |
| Attached To       | S3 bucket                               | IAM user                       |
| Trust Direction   | Bucket trusts the user                  | User requests access to S3     |
| Control Location  | Resource-based                          | Identity-based                 |
| Useful For        | Cross-account or public access          | Same-account internal access   |
| Risk Level        | 🟥 Full `s3:*` access (overkill)        | ✅ Scoped, Least Privilege      |
| Security Practice | OK if locked to one user, but too broad | Best practice for internal IAM |


## 🔐 Security Engineer Insight: Which One Should I <span class="strike">Use</span>?

✅ **Use IAM policy (identity-based)** when:

- You control the IAM user
- It’s within the same AWS account
- You want fine-grained control (list, get, put only)

🔄 **Use Bucket policy (resource-based)** when:

- You need to **grant access to external accounts or specific users**
- You want to **grant access without editing IAM**
- You're setting up **cross-account delegation**

⚠️ But in our case, the bucket policy you’re using grants `s3:*` - i.e., full permissions - which violates **Least Privilege** principles. 

It’s **better** to scope down the actions.



🧠 AWS uses **"least privilege AND logic"**:

> ✅ IAM allows + ✅ Bucket policy allows → ✅ Access  
> ❌ IAM denies OR ❌ Bucket policy denies → ❌ Access


---


## ✅ Final Outcome — What We <span class="strike">Built</span>

By the end of this project, we created a **secure and auditable S3 environment**, simulating real-world risks and applying best practices to fix them.

Here’s what the final setup looks like:


|Component|Final Secure Configuration|
|---|---|
|🪣 **S3 Bucket**|Public access blocked, private access only|
|🔐 **IAM User**|Least privilege access (read/write to one bucket only)|
|📜 **Bucket Policy**|Removed public policy, optionally restricted access via user ARN|
|🧾 **Custom IAM Policy**|Scoped access to a single bucket and its objects (no wild `s3:*`)|
|🔎 **Logging**|Enabled server access logging to a separate log bucket|
|🛡️ **Misconfiguration**|Simulated and then properly fixed with explanations|

---

## 🧠 What I Learned from This Project (If I Were a <span class="strike">Beginner</span>)

While guiding this project as a security engineer, if I were a beginner, these would be my biggest takeaways:

### 1. 🔓 S3 Buckets Can Be Dangerous If <span class="strike">Misconfigured</span>

Even one line in a bucket policy like `"Principal": "*"` can expose your private data to the internet. 

I now understand why **AWS gives so many red warnings** when you try to disable “Block Public Access.”

> ✅ Lesson: Always treat storage like it’s public by default - and lock it down intentionally.


### 2. 👤 IAM Policies Matter — A <span class="strike">Lot</span>

Giving **AmazonS3FullAccess** to any user feels like a quick fix - but it’s a **disaster waiting to happen**. 

I learned how to:

- Write my own scoped IAM policy
- Use only the actions I need (`GetObject`, `PutObject`, `ListBucket`)
- Follow the **Principle of Least Privilege**

> ✅ Lesson: Always ask - “Does this user really need this level of access?”


### 3. 🔄 IAM vs Bucket Policy — Two Ways to Grant <span class="strike">Access</span>

I didn’t just copy-paste JSON - I now understand:

- IAM policy = attached to user (identity-based)
- Bucket policy = attached to bucket (resource-based)
- How AWS evaluates both together using **"Allow + Allow = Access"**

> ✅ Lesson: Understand **where** to define access - not just **how**.



### 4. 📜 Access Logs Are Not <span class="strike">Optional</span>

Fixing a vulnerability isn’t complete until I know:

- If anyone **exploited it before**
- How the bucket is being accessed moving forward

I learned how to:

- Create a logging bucket
- Enable S3 server access logs
- Use logs for auditing and forensics

> ✅ Lesson: You can’t protect what you can’t monitor.


### 5. 💡 Security Isn’t Just Technical — It’s About <span class="strike">Intent</span>

I realized that good security comes from:

- Thinking like an attacker (how might someone abuse this config?)
- Thinking like an auditor (what if I need to prove this?)
- Thinking like a teacher (can I explain this to someone else?)

> ✅ Lesson: Every misconfiguration is a chance to learn, not just fix.


---

Misconfigurations don’t make you a bad engineer - ignoring them does. 

The real skill is knowing how to spot them, fix them, and build safer systems every time. 

This project was just the first step - keep going, stay curious, and always secure what you build.
